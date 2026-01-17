import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { addCredits, updateUserPlan, updateUserSubscription } from "@/lib/db";
import { headers } from "next/headers";

import { validateEvent } from "@polar-sh/sdk/webhooks";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const headersList = await headers();
    const signature = headersList.get("polar-webhook-signature");
    const secret = process.env.POLAR_WEBHOOK_SECRET;

    if (!signature) {
        console.error("Missing polar-webhook-signature header");
        const headerKeys = [];
        headersList.forEach((_, key) => headerKeys.push(key));
        return NextResponse.json({
            error: "Missing Signature Header",
            receivedHeaders: headerKeys.join(", ")
        }, { status: 400 });
    }

    if (!secret) {
        console.error("Missing POLAR_WEBHOOK_SECRET env var");
        return NextResponse.json({ error: "Missing Webhook Secret Config" }, { status: 400 });
    }

    // Verify signature
    let payload: any;
    try {
        // Headers object needs to be passed in a way validateEvent expects (usually IncomingHttpHeaders or similar record)
        // Converting Headers to simple object for compatibility if needed.
        const headersObj: Record<string, string> = {};
        headersList.forEach((value, key) => { headersObj[key] = value; });

        const event = validateEvent(rawBody, headersObj, secret);
        payload = event;
    } catch (e) {
        console.error("Webhook signature verification failed", e);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const eventType = payload.type;
    const data = payload.data;

    console.log(`Received Polar Webhook: ${eventType}`, data);

    try {
        switch (eventType) {
            case "subscription.active":
            case "subscription.created": {
                // Handle new subscription
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
                // Handle cancellation
                // Note: 'canceled' usually means it will expire at end of period. 'revoked' means immediate access loss.
                // For simplicity, we might downgrade on revocation or check status.
                const userId = data.metadata?.userId;
                if (userId) {
                    console.log(`Revoking subscription for ${userId}`);
                    // Downgrade to free, remove subscription ID
                    await updateUserPlan(userId, 'free', undefined);
                    await updateUserSubscription(userId, null);
                }
                break;
            }

            case "order.created": {
                // Handle one-time purchases (top-ups)
                const userId = data.metadata?.userId;
                const credits = parseInt(data.metadata?.credits || "0");

                // Only process if it's NOT a subscription initial order (which is handled above)
                // or if your logic separates them. 
                // data.subscription_id will be present if it's a sub order.

                if (userId && credits > 0 && !data.subscription_id) {
                    console.log(`Adding ${credits} credits to user ${userId} for one-time order`);
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
