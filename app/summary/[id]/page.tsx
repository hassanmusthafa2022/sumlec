"use client";
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { getSummaryById, SummaryData } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CheatSheetDisplay } from "@/components/CheatSheetDisplay";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function SummaryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const summaryId = params.id as string;

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
            return;
        }

        if (user && summaryId) {
            fetchSummary();
        }
    }, [user, authLoading, summaryId, router]);

    const fetchSummary = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getSummaryById(user.uid, summaryId);
            if (data) {
                setSummary(data);
            } else {
                setError("Summary not found");
            }
        } catch (e: any) {
            console.error("Failed to fetch summary:", e);
            setError("Failed to load summary");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin text-4xl">⟳</div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-950 text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-white mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>
                    </Link>
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold text-red-400">{error}</h1>
                        <p className="text-slate-400 mt-2">The summary you're looking for doesn't exist or you don't have access.</p>
                    </div>
                </div>
            </main>
        );
    }

    if (!summary) return null;

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 pb-6 border-b border-slate-800 mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-white hover:bg-slate-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white">{summary.videoTitle || "Untitled"}</h1>
                        <p className="text-sm text-slate-400">
                            Created {summary.createdAt?.toDate?.()?.toLocaleDateString() || "recently"}
                        </p>
                    </div>
                </header>

                {/* Summary Content */}
                <CheatSheetDisplay
                    summary={summary.summaryContent}
                    format={summary.outputFormat || "pdf"}
                    videoTitle={summary.videoTitle || "Your Notes"}
                    onClose={() => router.push('/dashboard')}
                />
            </div>
        </main>
    );
}
