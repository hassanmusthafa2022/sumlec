"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/db";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const { user, signInWithGoogle, loading } = useAuth();
    const router = useRouter();
    const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'premium'>('free');
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            getUserProfile(user.uid).then(p => {
                if (p) setUserPlan(p.plan || 'free');
            });
        }
    }, [user]);

    const handlePurchase = async (plan: 'pro' | 'premium') => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        setProcessing(plan);

        const planDetails = {
            pro: { priceId: 'bc92e5ce-b0ac-4637-bbf0-5a3a0c290741', credits: 25 },
            premium: { priceId: '6af5a05a-2edd-490f-b6a4-da505d759d19', credits: 170 }
        };
        const { priceId, credits } = planDetails[plan];

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId,
                    userId: user.uid,
                    credits,
                    plan
                }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Checkout URL missing");
                alert("Payment initiation failed (No URL returned)");
                setProcessing(null);
            }

        } catch (e) {
            console.error(e);
            alert("Payment initiation failed");
            setProcessing(null);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            {/* Navbar */}
            <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SummarizeLectures
                </Link>
                <div className="space-x-4 flex items-center">
                    {user ? (
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-white hover:bg-white/10">Back to Dashboard</Button>
                        </Link>
                    ) : (
                        <Link href="/">
                            <Button variant="ghost" className="text-white hover:bg-white/10">Home</Button>
                        </Link>
                    )}
                </div>
            </nav>

            <section className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose the plan that fits your study needs. Upgrade anytime.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">

                    {/* FREE PLAN */}
                    <Card className={`bg-white/5 border-white/10 flex flex-col ${userPlan === 'free' ? 'border-2 border-slate-500' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Free Starter</CardTitle>
                            <CardDescription className="text-gray-400">For trying it out</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 flex flex-col">
                            <div className="text-4xl font-bold text-white">$0</div>
                            <ul className="space-y-2 text-gray-300 flex-1">
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> 8 Free Credits</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> PDF & Slides Only</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> Max 2 Files Upload</li>
                            </ul>

                            {userPlan === 'free' ? (
                                <Link href={user ? "/dashboard" : "/"} className="w-full">
                                    <Button className="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-white">
                                        Current Plan (Go to Dashboard)
                                    </Button>
                                </Link>
                            ) : (
                                <Button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white" disabled>
                                    Included
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* PRO PLAN */}
                    <Card className={`bg-white/5 relative overflow-hidden flex flex-col ${userPlan === 'pro' ? 'border-2 border-purple-500' : 'border-purple-500/50'}`}>
                        {userPlan !== 'pro' && <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-lg">MOST POPULAR</div>}
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Pro Plan</CardTitle>
                            <CardDescription className="text-gray-300">For serious students</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 flex flex-col">
                            <div className="text-4xl font-bold text-white">$4.99</div>
                            <ul className="space-y-2 text-white flex-1">
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /> 25 Credits</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /> All Formats Unlocked</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /> Max 6 Files Upload</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /> Mind Map & Quiz</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> Buy Top-ups ($5/40)</li>
                            </ul>

                            {userPlan === 'pro' ? (
                                <Link href="/dashboard" className="w-full">
                                    <Button className="w-full mt-4 bg-purple-900/50 hover:bg-purple-900/70 text-purple-200 border border-purple-500">
                                        Current Active Plan
                                    </Button>
                                </Link>
                            ) : userPlan === 'premium' ? (
                                <Button className="w-full mt-4 bg-white/10 text-gray-400 cursor-not-allowed" disabled>
                                    Included in Premium
                                </Button>
                            ) : (
                                <Button className="w-full mt-4 btn-primary bg-purple-600 hover:bg-purple-700" onClick={() => handlePurchase('pro')} disabled={!!processing}>
                                    {processing === 'pro' ? 'Processing...' : 'Get Pro'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* PREMIUM PLAN */}
                    <Card className={`bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/50 flex flex-col ${userPlan === 'premium' ? 'border-2 border-blue-400 shadow-blue-500/20 shadow-lg' : ''}`}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Premium</CardTitle>
                            <CardDescription className="text-gray-300">Power user access</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 flex flex-col">
                            <div className="text-4xl font-bold text-white">$19.99</div>
                            <ul className="space-y-2 text-white flex-1">
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-400" /> 170 Credits</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-400" /> All Formats Unlocked</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-400" /> Max 10 Files Upload</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-blue-400" /> Priority Support</li>
                                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-400" /> Discount Top-ups ($4/40)</li>
                            </ul>

                            {userPlan === 'premium' ? (
                                <Link href="/dashboard" className="w-full">
                                    <Button className="w-full mt-4 bg-blue-900/50 hover:bg-blue-900/70 text-blue-200 border border-blue-500">
                                        Current Active Plan
                                    </Button>
                                </Link>
                            ) : (
                                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handlePurchase('premium')} disabled={!!processing}>
                                    {processing === 'premium' ? 'Processing...' : 'Get Premium'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Cancel Plan Section (Only for Paid Users) */}
                {(userPlan === 'pro' || userPlan === 'premium') && (
                    <div className="max-w-6xl mx-auto w-full mt-12 text-center">
                        <p className="text-gray-400 mb-4 text-sm">Need to take a break?</p>
                        <Button
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900/30"
                            onClick={async () => {
                                if (confirm("Are you sure you want to cancel your plan? You will lose access to premium features immediately.")) {
                                    setProcessing('cancel');
                                    try {
                                        const res = await fetch("/api/subscription/cancel", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ userId: user!.uid })
                                        });

                                        if (res.ok) {
                                            const data = await res.json();
                                            alert(data.message || "Plan cancelled successfully.");
                                            window.location.reload();
                                        } else {
                                            const err = await res.json();
                                            throw new Error(err.error || "Failed to cancel");
                                        }
                                    } catch (e: any) {
                                        console.error(e);
                                        alert("Failed to cancel subscription.");
                                    } finally {
                                        setProcessing(null);
                                    }
                                }
                            }}
                            disabled={!!processing}
                        >
                            {processing === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
                        </Button>
                    </div>
                )}


            </section>
        </main>
    );
}
