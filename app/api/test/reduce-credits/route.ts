import { NextRequest, NextResponse } from "next/server";
export const runtime = 'edge';
import { db } from "@/lib/firebase"; // Direct import to use Firebase functions
import { doc, updateDoc, increment } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const { userId, amount } = await req.json();

        if (!userId || !amount) {
            return NextResponse.json({ error: "Missing userId or amount" }, { status: 400 });
        }

        const creditsToReduce = parseInt(amount);

        // Direct DB update
        // Note: This relies on the permission rules we just added/updated
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            credits: increment(-creditsToReduce)
        });

        return NextResponse.json({ success: true, message: `Reduced ${creditsToReduce} credits` });

    } catch (err: any) {
        console.error("Reduce Credits Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
