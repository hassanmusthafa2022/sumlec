import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }

    return NextResponse.json({
        canReadSecret: !!process.env.POLAR_WEBHOOK_SECRET,
        secretLength: process.env.POLAR_WEBHOOK_SECRET?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseProject: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasGeminiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
}
