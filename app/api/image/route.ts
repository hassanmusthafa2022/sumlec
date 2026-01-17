import { NextRequest, NextResponse } from 'next/server';
import Replicate from "replicate";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
        return new NextResponse("Missing query", { status: 400 });
    }

    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
        // Run the model
        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: query,
                    aspect_ratio: "16:9"
                }
            }
        );

        // Replicate returns an array of output streams/URLs for this model
        // Flux Schnell usually returns a ReadableStream or URL
        const imageUrl = Array.isArray(output) ? output[0] : output;

        // If it's a URL (string) or a Stream, we need to fetch/read it to buffer it
        // The frontend expects an actual image response, not a redirect or JSON, to work with the existing <img> tags easily
        // (Though redirect is possible, proxying keeps the key hidden and headers controlled)

        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) throw new Error(`Failed to fetch image from Replicate: ${imageRes.statusText}`);

        const imageBuffer = await imageRes.arrayBuffer();
        const contentType = imageRes.headers.get("content-type") || "image/webp";

        return new NextResponse(Buffer.from(imageBuffer), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });

    } catch (error) {
        console.error("Replicate Image Gen Error:", error);
        return new NextResponse(`Image Generation Failed: ${error}`, { status: 500 });
    }
}
