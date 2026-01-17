import { NextRequest, NextResponse } from "next/server";
export const runtime = 'edge';
import { addCredits, updateUserPlan } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, plan, credits } = body;

        if (!userId || !plan) {
            return NextResponse.json({ error: "Missing userId or plan" }, { status: 400 });
        }

        console.log(`[DEV] Simulating webhook for ${userId} -> ${plan}`);

        // Simulate the logic from the real webhook
        const mockSubscriptionId = `sub_mock_${Date.now()}`;
        await updateUserPlan(userId, plan, mockSubscriptionId);

        if (credits) {
            await addCredits(userId, parseInt(credits));
        }

        return NextResponse.json({ success: true, message: `Upgraded ${userId} to ${plan}` });
    } catch (error: any) {
        console.error("Test Webhook Failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
