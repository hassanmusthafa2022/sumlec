import { NextRequest, NextResponse } from "next/server";
import { addCredits, updateUserPlan, updateUserSubscription } from "@/lib/db";
import { headers } from "next/headers";
import { validateEvent } from "@polar-sh/sdk/webhooks";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const headersList = await headers();

    // CORRECT HEADER NAME: "polar-signature" (NOT "polar-webhook-signature")
    const signature = headersList.get("polar-signature") || headersList.get("webhook-signature");
    const secret = process.env.POLAR_WEBHOOK_SECRET;

    if (!signature) {
        console.error("Missing signature header");
        return NextResponse.json({ error: "Missing Signature Header" }, { status: 400 });
    }

    if (!secret) {
        console.error("Missing POLAR_WEBHOOK_SECRET env var");
        return NextResponse.json({ error: "Missing Webhook Secret" }, { status: 400 });
    }

    // Verify signature
    let payload: any;
    try {
        const headersObj: Record<string, string> = {};
        headersList.forEach((value, key) => { headersObj[key] = value; });
        payload = validateEvent(rawBody, headersObj, secret);
    } catch (e) {
        console.error("Webhook signature verification failed", e);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const eventType = payload.type;
    const data = payload.data;

    console.log(`Received Polar Webhook: ${eventType}`);

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

            case "order.updated":
            case "order.created": {
                const userId = data.metadata?.userId;
                const credits = parseInt(data.metadata?.credits || "0");

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
