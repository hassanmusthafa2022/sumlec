import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, updateUserPlan, updateUserSubscription } from "@/lib/db";
import { polar } from "@/lib/polar";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userProfile = await getUserProfile(userId);
        if (!userProfile?.polarSubscriptionId) {
            return NextResponse.json({ error: "No active subscription found to cancel." }, { status: 400 });
        }

        // Cancel via Polar API
        try {
            await polar.subscriptions.revoke({ id: userProfile.polarSubscriptionId });
            console.log(`Cancelled subscription ${userProfile.polarSubscriptionId} for user ${userId}`);
        } catch (polarErr: any) {
            console.error("Polar API Cancel Error:", polarErr);
            // If error is 404, it might already be cancelled or invalid ID. We should proceed to update local DB anyway to sync state.
            if (!polarErr.message?.includes("404")) {
                throw polarErr;
            }
        }

        // Downgrade local user plan
        await updateUserPlan(userId, 'free', undefined);
        await updateUserSubscription(userId, null);

        return NextResponse.json({ success: true, message: "Plan cancelled successfully" });

    } catch (err: any) {
        console.error("Cancel Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
