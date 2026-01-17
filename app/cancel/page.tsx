"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center max-w-md text-center">
                <XCircle className="h-16 w-16 text-red-400 mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
                <p className="text-slate-300 mb-8">
                    You have not been charged. If you encountered an issue, please try again.
                </p>
                <div className="flex gap-4 w-full">
                    <Link href="/" className="flex-1">
                        <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                            Return Home
                        </Button>
                    </Link>
                    <Link href="/pricing" className="flex-1">
                        {/* Assuming pricing is on home page for now, but explicit link keeps intent clear */}
                        <Button className="w-full btn-primary">
                            Try Again
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
