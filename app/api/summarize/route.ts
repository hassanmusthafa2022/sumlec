import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini"; // model is gemini-2.5-flash
import { deductCredit, getUserProfile } from "@/lib/db";
import { PROMPTS } from "@/lib/prompts";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Cloudflare Edge Compatible!

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const url = formData.get("url") as string | null;
        const userId = formData.get("userId") as string | null;
        const mode = (formData.get("mode") as string) || "summary";
        const language = (formData.get("language") as string) || "auto";
        const outputFormat = (formData.get("outputFormat") as string) || "pdf";
        const fileCount = parseInt(formData.get("fileCount") as string) || 0;
        const pastPaperCount = parseInt(formData.get("pastPaperCount") as string) || 0;

        // 1. Auth & Validation
        if (!userId) {
            return NextResponse.json({ error: "User must be logged in" }, { status: 401 });
        }

        if (!url && fileCount === 0) {
            return NextResponse.json({ error: "Please provide a YouTube URL or upload files" }, { status: 400 });
        }

        const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (url && !YOUTUBE_REGEX.test(url)) {
            return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
        }

        // 2. Check Plan & Limits
        const userProfile = await getUserProfile(userId);
        const userPlan = userProfile?.plan || 'free';

        const PLAN_LIMITS = {
            free: { files: 2 },
            pro: { files: 6 },
            premium: { files: 10 }
        };

        const limits = PLAN_LIMITS[userPlan];

        if (fileCount > limits.files) {
            return NextResponse.json({
                error: `Upgrade required. ${userPlan === 'free' ? 'Free' : userPlan} plan is limited to ${limits.files} files.`
            }, { status: 403 });
        }

        const restrictedFormats = ['mindmap', 'flashcards', 'quiz'];
        if (userPlan === 'free' && restrictedFormats.includes(outputFormat)) {
            return NextResponse.json({
                error: `Upgrade required. ${outputFormat} generation is only available in Pro & Premium plans.`
            }, { status: 403 });
        }

        // Deduct Credit
        const hasCredit = await deductCredit(userId);
        if (!hasCredit) {
            return NextResponse.json({ error: "Insufficient credits. Please upgrade your plan or purchase more credits." }, { status: 403 });
        }

        const contentParts: any[] = [];
        let videoTitle = "Study Material";

        try {
            // 3. Process YouTube URL (Directly with Gemini!)
            if (url) {
                console.log("Processing YouTube URL directly:", url);
                videoTitle = "YouTube Video"; // Gemini 2.5 can infer title, but we don't get it back easily in response metadata yet.

                contentParts.push({
                    fileData: {
                        mimeType: "video/mp4",
                        fileUri: url
                    }
                });
            }

            // 4. Process Uploaded Files (Inline Base64 for Edge)
            for (let i = 0; i < fileCount; i++) {
                const file = formData.get(`file${i}`) as File | null;
                if (!file) continue;

                console.log(`Processing file ${i + 1}:`, file.name);
                if (i === 0 && !url) videoTitle = file.name;

                const buffer = Buffer.from(await file.arrayBuffer());
                const base64 = buffer.toString("base64");

                contentParts.push({
                    inlineData: {
                        data: base64,
                        mimeType: file.type
                    }
                });
            }

            // 5. Process Past Papers
            if (mode === 'examFocus' && pastPaperCount > 0) {
                contentParts.push("\n\n--- PAST EXAM PAPERS (for pattern analysis) ---\n");
                for (let i = 0; i < pastPaperCount; i++) {
                    const paper = formData.get(`pastPaper${i}`) as File | null;
                    if (!paper) continue;

                    const buffer = Buffer.from(await paper.arrayBuffer());
                    const base64 = buffer.toString("base64");

                    contentParts.push({
                        inlineData: {
                            data: base64,
                            mimeType: paper.type
                        }
                    });
                }
            }

            // 6. Build Prompt
            let prompt: string;
            if (outputFormat === 'slides') {
                prompt = PROMPTS.slides;
            } else if (outputFormat === 'flashcards') {
                prompt = PROMPTS.flashcards;
            } else if (outputFormat === 'quiz') {
                prompt = PROMPTS.quiz;
            } else if (outputFormat === 'mindmap') {
                prompt = PROMPTS.mindmap;
            } else if (mode === 'examFocus') {
                prompt = PROMPTS.examFocusWithPapers;
            } else {
                prompt = PROMPTS[mode as keyof typeof PROMPTS] || PROMPTS.summary;
            }

            // Language Handling
            let languageInstruction = "";
            if (language === "auto") {
                languageInstruction = "IMPORTANT: Generate the output in the SAME LANGUAGE as the input content.\n\n";
            } else {
                const langNames: Record<string, string> = {
                    en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian",
                    pt: "Portuguese", ru: "Russian", zh: "Chinese", ja: "Japanese", ko: "Korean",
                    ar: "Arabic", hi: "Hindi", ta: "Tamil", te: "Telugu", bn: "Bengali",
                    ur: "Urdu", tr: "Turkish", vi: "Vietnamese", th: "Thai", id: "Indonesian",
                    ms: "Malay", nl: "Dutch", pl: "Polish", uk: "Ukrainian", el: "Greek",
                    he: "Hebrew", sv: "Swedish", da: "Danish", fi: "Finnish", no: "Norwegian",
                    cs: "Czech", ro: "Romanian", hu: "Hungarian", si: "Sinhala"
                };
                const langName = langNames[language] || language;
                languageInstruction = `IMPORTANT: Generate ALL output ENTIRELY in ${langName}. Do not use any other language.\n\n`;
            }

            // Add instructions to content
            contentParts.push(languageInstruction + prompt);

            // 7. Generate
            console.log(`Generating ${mode} content...`);
            const result = await model.generateContent(contentParts);
            const responseText = result.response.text();
            console.log("Generation complete!");

            const videoId = `gen-${Date.now()}`;
            return NextResponse.json({
                summary: responseText,
                videoTitle,
                videoId,
                videoUrl: url || "File Upload"
            });

        } catch (error: any) {
            console.error("Gemini Generation Error:", error);
            let errorMessage = error.message || "Internal Server Error";
            if (errorMessage.includes("404")) errorMessage = "Video not found or is private/unavailable.";
            if (errorMessage.includes("403")) errorMessage = "Access denied to video.";

            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Request Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
