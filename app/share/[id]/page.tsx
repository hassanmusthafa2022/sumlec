"use client";

import React, { useEffect, useState } from 'react';
import { getSharedSummary, SummaryData } from '@/lib/db';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SharedPage({ params }: { params: Promise<{ id: string }> }) {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareId, setShareId] = useState<string>('');

    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params;
            setShareId(resolvedParams.id);
        };
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (!shareId) return;

        const fetchSummary = async () => {
            try {
                const data = await getSharedSummary(shareId);
                if (data) {
                    setSummary(data);
                } else {
                    setError('Summary not found or has been removed.');
                }
            } catch (e) {
                setError('Failed to load shared summary.');
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [shareId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin text-4xl">⟳</div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
                <BookOpen className="h-16 w-16 text-slate-600 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Oops!</h1>
                <p className="text-slate-400 mb-6">{error}</p>
                <Link href="/" className="text-purple-400 hover:text-purple-300 underline">
                    Go to SummarizeLectures →
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <nav className="w-full max-w-5xl mx-auto p-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SummarizeLectures
                </Link>
                <span className="text-xs text-slate-500 px-3 py-1 bg-white/5 rounded-full border border-slate-700">
                    Shared Summary
                </span>
            </nav>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {summary?.videoTitle || 'Study Guide'}
                    </h1>
                    <p className="text-sm text-slate-500 mb-6">
                        Shared from SummarizeLectures
                    </p>

                    <div className="prose prose-invert prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                            h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3 pb-2 border-b border-slate-700 text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-purple-300">{children}</h3>,
                            p: ({ children }) => <p className="mb-3 text-slate-300">{children}</p>,
                            strong: ({ children }) => <strong className="text-pink-400">{children}</strong>,
                            li: ({ children }) => <li className="text-slate-300 mb-1 ml-4">• {children}</li>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 my-4 italic text-slate-400">{children}</blockquote>,
                            table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full border border-slate-600">{children}</table></div>,
                            th: ({ children }) => <th className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-slate-600 text-left">{children}</th>,
                            td: ({ children }) => <td className="px-4 py-2 text-slate-300 border border-slate-700">{children}</td>,
                        }}>
                            {summary?.summaryContent || ''}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-center">
                    <p className="text-lg text-white mb-2">Want to create your own study guides?</p>
                    <p className="text-slate-400 text-sm mb-4">Turn any YouTube lecture into notes, flashcards, or quizzes instantly.</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                        Try SummarizeLectures Free →
                    </Link>
                </div>
            </div>
        </main>
    );
}
