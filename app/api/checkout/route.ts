export const runtime = 'edge';

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

        const result = await polar.checkouts.create({
            products: [priceId],
            successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                userId,
                credits: credits?.toString(),
                plan
            }
        });

        return NextResponse.json({ url: result.url });
    } catch (error: any) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Failed to create checkout session", details: error.message }, { status: 500 });
    }
}
