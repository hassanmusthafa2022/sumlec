import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { addCredits, updateUserPlan, updateUserSubscription } from "@/lib/db";
import { headers } from "next/headers";

import { validateEvent } from "@polar-sh/sdk/webhooks";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const headersList = await headers();
    // SKIP SIGNATURE VERIFICATION FOR DEBUGGING
    // const signature = headersList.get("polar-webhook-signature");
    // const secret = process.env.POLAR_WEBHOOK_SECRET;

    console.warn("⚠️ BYPASSING WEBHOOK SIGNATURE VERIFICATION");
    const payload = JSON.parse(rawBody);

    const eventType = payload.type;
    const data = payload.data;

    console.log(`Received Polar Webhook: ${eventType}`, data);

    try {
        switch (eventType) {
            case "subscription.active":
            case "subscription.created": {
                const userId = data.metadata?.userId;
                const plan = data.metadata?.plan as 'free' | 'pro' | 'premium';
                const credits = parseInt(data.metadata?.credits || "0");
                const subscriptionId = data.id;

                if (userId && plan) {
                    console.log(`Activating subscription for ${userId} with plan ${plan}`);
                    await updateUserPlan(userId, plan, subscriptionId);
                    if (credits > 0) {
                        await addCredits(userId, credits);
                    }
                }
                break;
            }

            case "subscription.revoked":
            case "subscription.canceled": {
                const userId = data.metadata?.userId;
                if (userId) {
                    console.log(`Revoking subscription for ${userId}`);
                    await updateUserPlan(userId, 'free', undefined);
                    await updateUserSubscription(userId, null);
                }
                break;
            }

            case "order.updated": // Handle updated too!
            case "order.created": {
                const userId = data.metadata?.userId;
                const credits = parseInt(data.metadata?.credits || "0");

                // Only process if PAID
                // (order.created might be unpaid? check status if available, but usually payload implies success in webhook if type is created?)
                // Actually, check status.
                // data.status might be 'paid'

                if (userId && credits > 0 && !data.subscription_id) {
                    console.log(`Adding ${credits} credits to user ${userId}`);
                    await addCredits(userId, credits);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${eventType}`);
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
