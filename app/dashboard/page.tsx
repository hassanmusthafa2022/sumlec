"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { getUserCredits, getUserSummaries, deleteSummary, getUserProfile, SummaryData } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Zap, Calendar, User as UserIcon, Trash2 } from "lucide-react";
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Generator } from "@/components/Generator";
import { CheatSheetDisplay } from "@/components/CheatSheetDisplay";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [credits, setCredits] = useState<number | null>(null);
    const [summaries, setSummaries] = useState<SummaryData[]>([]);
    const [fetching, setFetching] = useState(true);
    const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
    const [generatedFormat, setGeneratedFormat] = useState<string>('pdf');
    const [generatedTitle, setGeneratedTitle] = useState<string>('Your Content');
    const [error, setError] = useState<string>("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'premium'>('free'); // RESTORED missing state
    const [reduceAmount, setReduceAmount] = useState<string>("5");
    const [testingAction, setTestingAction] = useState(false);

    // Handle Mock Success (triggered by server fallback)
    useEffect(() => {
        // ... (existing mock logic is fine)
    }, [user, router]);

    // Main Data Fetch Effect
    useEffect(() => {
        if (!loading && !user) {
            console.log("No user found, redirecting...");
            setFetching(false); // FIX: Stop loading spinner
            router.push("/");
        } else if (user) {
            fetchUserData();
        }
    }, [user, loading, router]);
    useEffect(() => {
        // Debug
        console.log("Checking for mock params...");
        const params = new URLSearchParams(window.location.search);

        if (params.get('mock_success') === 'true') {
            console.log("Mock success detected");

            if (user) {
                console.log("User detected, performing update");
                const creditsToAdd = parseInt(params.get('credits') || '0');
                const newPlan = params.get('plan') as 'pro' | 'premium' | null;

                // Perform updates
                const performMockUpdate = async () => {
                    try {
                        const { addCredits, updateUserPlan } = await import("@/lib/db");

                        // Execute DB writes
                        if (creditsToAdd > 0) {
                            console.log(`Adding ${creditsToAdd} credits...`);
                            await addCredits(user.uid, creditsToAdd);
                        }

                        if (newPlan) {
                            console.log(`Updating plan to ${newPlan}...`);
                            await updateUserPlan(user.uid, newPlan);
                        }

                        alert(`MOCK UPDATE SUCCESSFUL!\nAdded ${creditsToAdd} credits.\nPlan: ${newPlan || 'Unchanged'}`);

                        // Clear URL and Refresh
                        router.replace('/dashboard');
                        window.location.href = '/dashboard'; // Force full reload to be safe and clear params
                    } catch (e) {
                        console.error("Mock Update Failed:", e);
                        alert("Mock Update Failed: " + JSON.stringify(e));
                    }
                };

                performMockUpdate();
            } else {
                console.log("Waiting for user auth...");
            }
        }
    }, [user, router]); // Run when user is loaded

    // Product IDs from Polar - update these with your actual Polar Product IDs
    const PRODUCT_IDS: Record<string, string> = {
        'pro': process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID || '',
        'premium': process.env.NEXT_PUBLIC_POLAR_PREMIUM_PRODUCT_ID || '',
        'credits_pro': process.env.NEXT_PUBLIC_POLAR_CREDITS_PRO_PRODUCT_ID || '',      // $5 for 40 credits
        'credits_premium': process.env.NEXT_PUBLIC_POLAR_CREDITS_PREMIUM_PRODUCT_ID || '', // $4 for 40 credits
    };

    const handlePurchase = async (planType: string, mode?: 'subscription' | 'credits') => {
        if (!user) return;

        // For credit purchases, pick the right product based on user's current plan
        let productKey = planType;
        if (planType === 'credits') {
            productKey = userPlan === 'premium' ? 'credits_premium' : 'credits_pro';
        }

        const productId = PRODUCT_IDS[productKey];
        if (!productId) {
            alert(`Please configure NEXT_PUBLIC_POLAR_${productKey.toUpperCase().replace('_', '_')}_PRODUCT_ID in environment variables`);
            return;
        }

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId: productId,
                    userId: user.uid,
                    credits: planType === 'credits' ? 40 : (planType === 'pro' ? 25 : 50),
                    plan: planType === 'credits' ? undefined : planType
                }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Checkout error:", data.error);
                alert(`Checkout failed: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Payment failed to initialize");
        }
    };

    const fetchUserData = async () => {
        console.log("fetchUserData called, user:", user?.uid); // Debug
        if (!user) {
            setFetching(false); // FIX: Ensure we stop loading if no user
            return;
        }

        // Safety Timeout: Force stop loading after 15 seconds if DB hangs
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Data fetch timed out")), 15000)
        );

        try {
            await Promise.race([
                (async () => {
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        setCredits(profile.credits);
                        setUserPlan(profile.plan || 'free');
                    }
                    const s = await getUserSummaries(user.uid);
                    setSummaries(s);
                })(),
                timeoutPromise
            ]);
        } catch (error: any) {
            if (error?.message === "Data fetch timed out") {
                console.warn("Data fetch took too long, proceeding with cached/partial data.");
            } else {
                console.error("Fetch User Data Error:", error);
            }
        } finally {
            console.log("fetchUserData finished (or timed out)"); // Debug
            setFetching(false);
        }
    };

    const handleDelete = async (summaryId: string) => {
        if (!user || !summaryId) return;
        // if (!confirm("Are you sure you want to delete this summary?")) return;

        setDeleting(summaryId);
        try {
            const success = await deleteSummary(user.uid, summaryId);
            if (success) {
                setSummaries(summaries.filter(s => s.id !== summaryId));
            } else {
                alert("Failed to delete summary");
            }
        } catch (e) {
            console.error("Delete error:", e);
            alert("Failed to delete summary");
        } finally {
            setDeleting(null);
        }
    };

    const handleReduceCredits = async () => {
        if (!user || !reduceAmount) return;
        setTestingAction(true);
        try {
            const res = await fetch("/api/test/reduce-credits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.uid, amount: parseInt(reduceAmount) }),
            });
            const data = await res.json();
            if (data.success) {
                alert(`Reduced ${reduceAmount} credits`);
                fetchUserData();
            } else {
                alert("Failed: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error reducing credits");
        } finally {
            setTestingAction(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!user) return;
        if (!confirm("Are you sure you want to cancel your subscription? This will revert you to the Free plan.")) return;
        setTestingAction(true);
        try {
            const res = await fetch("/api/subscription/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.uid }),
            });
            const data = await res.json();
            if (data.success) {
                alert("Subscription cancelled. Reverted to Free plan.");
                fetchUserData();
            } else {
                alert("Failed: " + data.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error cancelling subscription");
        } finally {
            setTestingAction(false);
        }
    };

    // Safety: Force Auth Loading to stop if it hangs (common in dev environment)
    const [authTimedOut, setAuthTimedOut] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                console.warn("Auth Check Timed Out - Forcing UI Render");
                setAuthTimedOut(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [loading]);

    if ((loading && !authTimedOut) || fetching) { // Show loading state while checking auth or fetching data
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-8">
                    {/* Animated Logo */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        {/* Spinning ring */}
                        <div className="absolute inset-0 -m-2 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-3xl animate-spin" style={{ animationDuration: '2s' }} />
                    </div>

                    {/* Brand */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            SummarizeLecture.ai
                        </h1>
                        <p className="text-slate-500 mt-2 text-sm tracking-wider uppercase">
                            <span className="inline-block animate-pulse">Loading your workspace</span>
                            <span className="inline-block ml-1 animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                            <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                            <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>.</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-center pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hover:opacity-80 transition-opacity">
                            SummarizeLecture.ai
                        </Link>
                        <span className="text-slate-500">/</span>
                        <span className="font-semibold text-slate-200">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Plan Badge & Top-Up */}
                        <div className="flex items-center gap-3">
                            {/* Clickable Plan Badge */}
                            <Link href="/pricing">
                                <div className={`hidden md:flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity ${userPlan === 'premium' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' :
                                    userPlan === 'pro' ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20' :
                                        'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                    {userPlan} Plan
                                </div>
                            </Link>

                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-green-400 hover:text-green-300"
                                            onClick={() => {
                                                if (userPlan === 'free') return; // Do nothing on click for free, let tooltip explain
                                                handlePurchase('credits', 'credits');
                                            }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 border-slate-800 text-white">
                                        {userPlan === 'free' ? (
                                            <p>Top-up available for Pro/Premium users</p>
                                        ) : (
                                            <p>Buy 40 Credits ({userPlan === 'premium' ? '$4' : '$5'})</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                            <Zap className="text-yellow-400 h-4 w-4" />
                            <span className="font-mono font-bold text-white">{credits} Credits</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <UserIcon className="h-4 w-4 text-slate-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-300 hidden md:block">{user?.displayName}</span>
                        </div>
                    </div>
                </header>

                {/* Generator Section */}
                <div className="flex flex-col gap-6 relative z-10">
                    <h2 className="text-2xl font-bold text-white">Create New Summary</h2>
                    <Generator
                        onGenerate={(summary, format, title) => {
                            setGeneratedSummary(summary);
                            setGeneratedFormat(format);
                            setGeneratedTitle(title || 'Your Content');
                            fetchUserData(); // Refresh credits and list
                            setError("");
                        }}
                        onError={(err) => setError(err)}
                        userPlan={userPlan}
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>

                {/* Show Generated Summary */}
                {generatedSummary && (
                    <CheatSheetDisplay
                        summary={generatedSummary}
                        format={generatedFormat}
                        videoTitle={generatedTitle}
                        onClose={() => setGeneratedSummary(null)}
                    />
                )}

                {/* Library Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Your Library</h1>
                </div>

                {/* Content Grid */}
                {summaries.length === 0 ? (
                    <Card className="bg-slate-900/50 border-slate-800 border-dashed py-20 text-center">
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 bg-slate-800/50 rounded-full flex items-center justify-center">
                                <FileText className="h-8 w-8 text-slate-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">No summaries yet</h3>
                                <p className="text-slate-400 mt-1">Use the generator above to create your first cheat sheet.</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="mt-4 border-slate-700 hover:bg-slate-800 text-white hover:text-white"
                            >
                                Start Generating
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaries.map((summary) => (
                            <Card key={summary.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg group overflow-hidden flex flex-col">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                                        {summary.videoTitle || "Untitled Summary"}
                                    </CardTitle>
                                    <CardDescription className="flex items-center text-slate-400 text-xs mt-1">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {summary.createdAt?.toDate().toLocaleDateString() || "Just now"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="prose prose-invert prose-sm max-h-40 overflow-hidden text-slate-300 relative">
                                        {/* Check if content is JSON (flashcards/quiz) - handle code blocks too */}
                                        {(() => {
                                            // Try to extract JSON from content (may be wrapped in code blocks)
                                            const content = summary.summaryContent;
                                            // Match JSON Arrays OR Objects (for Mind Maps)
                                            const jsonMatch = content.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);

                                            if (jsonMatch) {
                                                try {
                                                    const parsed = JSON.parse(jsonMatch[0]);

                                                    // 1. Handle Arrays (Quiz, Flashcards, Slides)
                                                    if (Array.isArray(parsed) && parsed.length > 0) {
                                                        if (parsed[0]?.question) {
                                                            return (
                                                                <div className="text-slate-400">
                                                                    <p className="font-semibold text-purple-400">❓ Quiz ({parsed.length} questions)</p>
                                                                    {parsed.slice(0, 2).map((q: any, i: number) => (
                                                                        <p key={i} className="text-sm truncate">• {q.question}</p>
                                                                    ))}
                                                                    {parsed.length > 2 && <p className="text-xs text-slate-500">+{parsed.length - 2} more questions</p>}
                                                                </div>
                                                            );
                                                        } else if (parsed[0]?.front) {
                                                            return (
                                                                <div className="text-slate-400">
                                                                    <p className="font-semibold text-cyan-400">🃏 Flashcards ({parsed.length} cards)</p>
                                                                    {parsed.slice(0, 2).map((card: any, i: number) => (
                                                                        <p key={i} className="text-sm truncate">• {card.front}</p>
                                                                    ))}
                                                                    {parsed.length > 2 && <p className="text-xs text-slate-500">+{parsed.length - 2} more cards</p>}
                                                                </div>
                                                            );
                                                        } else if (parsed[0]?.title && parsed[0]?.bullets) {
                                                            return (
                                                                <div className="text-slate-400">
                                                                    <p className="font-semibold text-pink-400">🎬 Slides ({parsed.length} slides)</p>
                                                                    {parsed.slice(0, 2).map((slide: any, i: number) => (
                                                                        <p key={i} className="text-sm truncate">• {slide.title}</p>
                                                                    ))}
                                                                    {parsed.length > 2 && <p className="text-xs text-slate-500">+{parsed.length - 2} more slides</p>}
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                    // 2. Handle Objects (Mind Map)
                                                    else if (parsed && typeof parsed === 'object' && parsed.root) {
                                                        const childCount = Array.isArray(parsed.children) ? parsed.children.length : 0;
                                                        return (
                                                            <div className="text-slate-400">
                                                                <p className="font-semibold text-purple-400">🧠 Mind Map</p>
                                                                <p className="text-sm font-bold text-white mb-1 truncate">{parsed.root}</p>
                                                                {Array.isArray(parsed.children) && parsed.children.slice(0, 3).map((child: any, i: number) => (
                                                                    <p key={i} className="text-sm truncate pl-2 border-l-2 border-slate-700">• {child.text}</p>
                                                                ))}
                                                                {childCount > 3 && <p className="text-xs text-slate-500 pl-2">+{childCount - 3} more branches</p>}
                                                            </div>
                                                        );
                                                    }
                                                } catch {
                                                    // JSON parse failed, fall through to markdown
                                                }
                                            }
                                            // Default: render as markdown
                                            return <ReactMarkdown>{content}</ReactMarkdown>;
                                        })()}
                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent" />
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link href={`/summary/${summary.id}`} className="flex-1">
                                            <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                                                View Full Notes
                                            </Button>
                                        </Link>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("Deleting summary:", summary.id);
                                                if (summary.id) handleDelete(summary.id);
                                            }}
                                            disabled={deleting === summary.id}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 relative z-20"
                                        >
                                            {deleting === summary.id ? (
                                                <span className="animate-spin">⟳</span>
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

        </main >
    );
}
