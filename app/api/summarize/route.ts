import { NextRequest, NextResponse } from "next/server";
import YtDlpWrap from 'yt-dlp-wrap';
import { fileManager, model } from "@/lib/gemini";
import { deductCredit, getUserProfile } from "@/lib/db";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

// Increase timeout for long generations
export const maxDuration = 60; // 60 seconds (Hobby plan limit) or higher on Pro
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const unlink = promisify(fs.unlink);


import { PROMPTS } from "@/lib/prompts";

// Helper: Upload file to Gemini and wait for ACTIVE
async function uploadToGemini(filePath: string, mimeType: string, displayName: string) {
    const uploadResult = await fileManager.uploadFile(filePath, { mimeType, displayName });
    let uploadedFile = uploadResult.file;

    while (uploadedFile.state === "PROCESSING") {
        await new Promise(resolve => setTimeout(resolve, 2000));
        uploadedFile = await fileManager.getFile(uploadedFile.name);
    }

    if (uploadedFile.state === "FAILED") {
        throw new Error("File processing failed on Gemini's servers.");
    }

    return uploadedFile;
}

export async function POST(req: NextRequest) {
    const tempFiles: string[] = []; // Track all temp files for cleanup

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

        // Plan Limits
        const PLAN_LIMITS = {
            free: { files: 2, features: ['summary', 'deepDive', 'examFocus', 'pdf', 'slides'] },
            pro: { files: 6, features: ['all'] },
            premium: { files: 10, features: ['all'] }
        };

        const limits = PLAN_LIMITS[userPlan];

        // Check File Count
        if (fileCount > limits.files) {
            return NextResponse.json({
                error: `Upgrade required. ${userPlan === 'free' ? 'Free' : userPlan} plan is limited to ${limits.files} files.`
            }, { status: 403 });
        }

        // Check Feature Access (for outputFormat)
        // 'all' allows everything. Otherwise check list.
        // We only gate 'flashcards', 'quiz', 'mindmap' for free users usually.
        // The implementation plan says: Free restricted to PDF/Slides.
        // So free users cannot use 'mindmap', 'flashcards', 'quiz'.
        // Modes are generally open, but output formats are restricted.

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

        const uploadedFiles: { uri: string; mimeType: string }[] = [];
        let videoTitle = "Study Material";

        try {
            // 3. Process YouTube URL with retry logic
            if (url) {
                console.log("Processing YouTube URL with yt-dlp:", url);

                // Ensure yt-dlp binary exists
                const binaryPath = path.join(process.cwd(), 'bin', 'yt-dlp' + (os.platform() === 'win32' ? '.exe' : ''));
                if (!fs.existsSync(path.dirname(binaryPath))) {
                    fs.mkdirSync(path.dirname(binaryPath), { recursive: true });
                }

                if (!fs.existsSync(binaryPath)) {
                    console.log("Downloading yt-dlp binary to", binaryPath);
                    await YtDlpWrap.downloadFromGithub(binaryPath);
                }

                const ytDlp = new YtDlpWrap(binaryPath);

                // Get metadata
                try {
                    const metadata = await ytDlp.execPromise([url, '-J']);
                    const info = JSON.parse(metadata);
                    videoTitle = info.title;
                } catch (e) {
                    console.error("Failed to fetch video metadata:", e);
                    videoTitle = "YouTube Video";
                }

                const videoId = `yt-${Date.now()}`;
                const tempFilePath = path.join(os.tmpdir(), `${videoId}.mp3`);
                tempFiles.push(tempFilePath);

                // Retry logic: 3 attempts with exponential backoff
                const MAX_RETRIES = 3;
                let lastError: Error | null = null;

                for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                    try {
                        console.log(`Downloading audio (attempt ${attempt})...`);
                        await new Promise<void>((resolve, reject) => {
                            const timeout = setTimeout(() => reject(new Error("YouTube download timed out (120s)")), 120000);

                            const stream = ytDlp.execStream([
                                url,
                                '-f', 'bestaudio',
                                '-o', '-'
                            ]);

                            const writeStream = fs.createWriteStream(tempFilePath);
                            stream.pipe(writeStream);

                            writeStream.on('finish', () => { clearTimeout(timeout); resolve(); });
                            writeStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
                            stream.on('error', (err: any) => { clearTimeout(timeout); reject(err); });
                        });
                        lastError = null;
                        break; // Success
                    } catch (err: any) {
                        lastError = err;
                        console.log(`YouTube download attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
                        if (attempt < MAX_RETRIES) {
                            await new Promise(r => setTimeout(r, Math.pow(2, attempt - 1) * 1000));
                        }
                    }
                }

                if (lastError) {
                    throw lastError;
                }

                const uploaded = await uploadToGemini(tempFilePath, "audio/mp3", `Audio-${videoId}`);
                uploadedFiles.push({ uri: uploaded.uri, mimeType: "audio/mp3" });
            }

            // 4. Process uploaded files
            for (let i = 0; i < fileCount; i++) {
                const file = formData.get(`file${i}`) as File | null;
                if (!file) continue;

                console.log(`Processing file ${i + 1}:`, file.name);
                if (i === 0 && !url) videoTitle = file.name;

                const buffer = Buffer.from(await file.arrayBuffer());
                const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
                tempFiles.push(tempFilePath);
                await fs.promises.writeFile(tempFilePath, buffer);

                const uploaded = await uploadToGemini(tempFilePath, file.type, file.name);
                uploadedFiles.push({ uri: uploaded.uri, mimeType: file.type });
            }

            // 5. Process past papers (for exam mode)
            const pastPaperFiles: { uri: string; mimeType: string }[] = [];
            if (mode === 'examFocus' && pastPaperCount > 0) {
                for (let i = 0; i < pastPaperCount; i++) {
                    const paper = formData.get(`pastPaper${i}`) as File | null;
                    if (!paper) continue;

                    console.log(`Processing past paper ${i + 1}:`, paper.name);
                    const buffer = Buffer.from(await paper.arrayBuffer());
                    const tempFilePath = path.join(os.tmpdir(), `pastpaper-${Date.now()}-${paper.name}`);
                    tempFiles.push(tempFilePath);
                    await fs.promises.writeFile(tempFilePath, buffer);

                    const uploaded = await uploadToGemini(tempFilePath, paper.type, `PastPaper-${paper.name}`);
                    pastPaperFiles.push({ uri: uploaded.uri, mimeType: paper.type });
                }
            }

            let prompt: string;
            if (outputFormat === 'slides') {
                prompt = PROMPTS.slides;
            } else if (outputFormat === 'flashcards') {
                prompt = PROMPTS.flashcards;
            } else if (outputFormat === 'quiz') {
                prompt = PROMPTS.quiz;
            } else if (outputFormat === 'mindmap') {
                prompt = PROMPTS.mindmap;
            } else if (mode === 'examFocus' && pastPaperFiles.length > 0) {
                prompt = PROMPTS.examFocusWithPapers;
            } else {
                prompt = PROMPTS[mode as keyof typeof PROMPTS] || PROMPTS.summary;
            }

            // Add language instruction
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
            prompt = languageInstruction + prompt;

            // 7. Build content array for Gemini
            const contentParts: any[] = [prompt];

            // Add main content files
            for (const file of uploadedFiles) {
                contentParts.push({
                    fileData: { mimeType: file.mimeType, fileUri: file.uri }
                });
            }

            // Add past papers with labels
            if (pastPaperFiles.length > 0) {
                contentParts.push("\n\n--- PAST EXAM PAPERS (for pattern analysis) ---\n");
                for (const paper of pastPaperFiles) {
                    contentParts.push({
                        fileData: { mimeType: paper.mimeType, fileUri: paper.uri }
                    });
                }
            }

            // 8. Generate with Gemini
            console.log(`Generating ${mode} content with ${uploadedFiles.length} files and ${pastPaperFiles.length} past papers...`);
            const result = await model.generateContent(contentParts);
            const responseText = result.response.text();
            console.log("Generation complete!");

            // Return data for client-side saving (server-side Firebase SDK doesn't have auth context)
            const videoId = `gen-${Date.now()}`;
            return NextResponse.json({
                summary: responseText,
                videoTitle,
                videoId,
                videoUrl: url || "File Upload"
            });

        } finally {
            // Cleanup ALL temp files
            for (const tempFile of tempFiles) {
                try {
                    await unlink(tempFile);
                } catch (e) {
                    console.error("Cleanup error:", e);
                }
            }
        }

    } catch (error: any) {
        console.error("Error processing request:", error);

        let errorMessage = error.message || "Internal Server Error";
        let statusCode = 500;

        if (error.statusCode === 403 || error.message?.includes("Status code: 403")) {
            errorMessage = "YouTube blocked this video. Try a different video or upload files directly.";
            statusCode = 403;
        } else if (error.code === "ENOSPC") {
            errorMessage = "Server disk is full. Please contact support.";
        } else if (error.message?.includes("timed out")) {
            errorMessage = "Download timed out. The video may be too long.";
        }

        return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
}
