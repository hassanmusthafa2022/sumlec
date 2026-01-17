"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function SuccessPage() {
    useEffect(() => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
            <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl flex flex-col items-center max-w-md text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                <p className="text-slate-300 mb-8">
                    Thank you for your purchase. Your credits have been added to your account.
                </p>
                <Link href="/dashboard">
                    <Button className="btn-primary w-full text-lg h-12">
                        Go to Dashboard
                    </Button>
                </Link>
            </div>
        </main>
    );
}
