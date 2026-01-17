import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { addCredits, updateUserPlan } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || "0");
        const plan = session.metadata?.plan as 'free' | 'pro' | 'premium' | undefined;
        // const type = session.metadata?.type; // 'credits' or 'subscription' (optional usage)

        if (userId && credits > 0) {
            console.log(`Adding ${credits} credits to user ${userId}`);
            await addCredits(userId, credits);

            if (plan) {
                console.log(`Updating user ${userId} plan to ${plan}`);
                await updateUserPlan(userId, plan);
            }
        }
    }

    return NextResponse.json({ received: true });
}
