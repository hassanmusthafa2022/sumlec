import { NextRequest, NextResponse } from "next/server";
import { model, fileManager } from "@/lib/gemini";
import { deductCredit, getUserProfile } from "@/lib/db";
import { PROMPTS } from "@/lib/prompts";
import YtDlpWrap from 'yt-dlp-wrap';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const maxDuration = 300; // 5 mins timeout for download
export const dynamic = 'force-dynamic';

// Helper to ensure yt-dlp binary exists (robust for Railway/Render)
const ensureYtDlp = async () => {
    const binaryPath = path.join(os.tmpdir(), 'yt-dlp');
    // Only download if doesn't exist or is empty
    if (!fs.existsSync(binaryPath) || fs.statSync(binaryPath).size === 0) {
        console.log("Downloading yt-dlp binary to:", binaryPath);
        await YtDlpWrap.downloadFromGithub(binaryPath);
        fs.chmodSync(binaryPath, '755');
    }
    return new YtDlpWrap(binaryPath);
};

export async function POST(req: NextRequest) {
    console.log("Summarize API v2.1 (Robust Fallback) Hit");
    let tempFilePath = ""; // For cleanup

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
        if (!userId) return NextResponse.json({ error: "User must be logged in" }, { status: 401 });
        if (!url && fileCount === 0) return NextResponse.json({ error: "Provide URL or files" }, { status: 400 });

        // 2. Check Credits
        const hasCredit = await deductCredit(userId);
        if (!hasCredit) return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });

        const contentParts: any[] = [];
        let videoTitle = "Study Material";

        try {
            // 3. Process YouTube URL
            if (url) {
                console.log("Processing YouTube URL:", url);

                // Fallback Strategy:
                // Plan A: Try Gemini Direct URL (Fastest)
                // Plan B: If that fails, download with yt-dlp and upload (Reliable)

                let geminiDirectWorked = false;
                try {
                    console.log("Attempting Direct Gemini URL Access...");
                    // We can't easily validte if this works until generation time, 
                    // but we can try to rely on it.
                    // However, we recently saw "Access Denied". 
                    // So let's prioritize yt-dlp download if we are on a real server (Railway).
                    // Actually, let's just go straight to yt-dlp for maximum reliability on Railway.
                    throw new Error("Skipping Direct URL to ensure reliability via download");
                } catch (e) {
                    // Fallthrough to download
                }

                // Plan B: Download with yt-dlp
                console.log("Starting yt-dlp process...");
                const ytDlp = await ensureYtDlp();

                // Get Metadata first
                const metadata = await ytDlp.getVideoInfo(url);
                videoTitle = metadata.title;
                console.log("Video Title:", videoTitle);

                // Generate temp path
                tempFilePath = path.join(os.tmpdir(), `${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);

                // Download Audio
                console.log("Downloading audio to:", tempFilePath);
                await ytDlp.execPromise([
                    url,
                    '-f', 'ba', // Best audio
                    '-x',       // Extract audio
                    '--audio-format', 'mp3',
                    '-o', tempFilePath
                ]);

                // Upload to Gemini
                console.log("Uploading audio to Gemini...");
                const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                    mimeType: "audio/mp3",
                    displayName: videoTitle
                });

                // Poll for processing state
                console.log("Waiting for Gemini processing...");
                let file = await fileManager.getFile(uploadResponse.file.name);
                while (file.state === "PROCESSING") {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    file = await fileManager.getFile(uploadResponse.file.name);
                }

                if (file.state === "FAILED") {
                    throw new Error("Gemini failed to process the downloaded audio.");
                }

                console.log("Audio ready. URI:", file.uri);
                contentParts.push({
                    fileData: {
                        mimeType: file.mimeType,
                        fileUri: file.uri
                    }
                });
            }

            // 4. Process Uploaded Files
            for (let i = 0; i < fileCount; i++) {
                const file = formData.get(`file${i}`) as File | null;
                if (!file) continue;
                if (i === 0 && !url) videoTitle = file.name;

                const buffer = Buffer.from(await file.arrayBuffer());
                const base64 = buffer.toString("base64");
                contentParts.push({
                    inlineData: { data: base64, mimeType: file.type }
                });
            }

            // 5. Build Prompt
            let prompt = PROMPTS[mode] || PROMPTS.summary;
            if (outputFormat === 'slides') prompt = PROMPTS.slides;
            else if (outputFormat === 'flashcards') prompt = PROMPTS.flashcards;
            else if (outputFormat === 'quiz') prompt = PROMPTS.quiz;
            else if (outputFormat === 'mindmap') prompt = PROMPTS.mindmap;

            const languageInstruction = language === "auto"
                ? "IMPORTANT: Output in the SAME LANGUAGE as input."
                : `IMPORTANT: Output ENTIRELY in ${language}.`;

            const fullPrompt = `${languageInstruction}\n\n${prompt}`;

            // 6. Generate
            console.log("Generating content...");
            const result = await model.generateContent([fullPrompt, ...contentParts]);
            const responseText = result.response.text();

            // Cleanup temp file
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }

            return NextResponse.json({
                summary: responseText,
                title: videoTitle,
                videoUrl: url || "File Upload"
            });

        } catch (error: any) {
            console.error("Processing Logic Error:", error);
            // Cleanup on error
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            return NextResponse.json({ error: "Processing failed: " + error.message }, { status: 500 });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
