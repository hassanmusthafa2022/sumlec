import { polar } from "@/lib/polar";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { priceId, userId, credits, plan } = body;

        console.log("Creating checkout for price:", priceId);

        if (!process.env.POLAR_ACCESS_TOKEN) {
            console.error("Missing POLAR_ACCESS_TOKEN");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        if (!priceId) {
            return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
        }

        // Build metadata without undefined values (Polar rejects them)
        const metadata: Record<string, string> = {
            userId: userId || '',
            credits: credits?.toString() || '0',
        };
        if (plan) {
            metadata.plan = plan;
        }

        const result = await polar.checkouts.create({
            products: [priceId],
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            metadata
        });

        return NextResponse.json({ url: result.url });
    } catch (error: any) {
        console.error("Checkout error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));

        // Return more details to help debug
        const errorMessage = error?.body?.detail || error?.message || "Unknown error";
        return NextResponse.json({
            error: "Failed to create checkout session",
            details: errorMessage
        }, { status: 500 });
    }
}
