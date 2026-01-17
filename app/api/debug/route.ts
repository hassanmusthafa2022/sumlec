import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        canReadSecret: !!process.env.POLAR_WEBHOOK_SECRET,
        secretLength: process.env.POLAR_WEBHOOK_SECRET?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseProject: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasGeminiKey: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
}
