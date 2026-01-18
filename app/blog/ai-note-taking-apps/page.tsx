import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, Star, ChevronRight, Brain, Mic, FileText, Zap, BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "10 Best AI Note Taking Apps for Students in 2026 | Free & Paid",
    description: "Discover the best AI note taking apps that automatically transcribe lectures, summarize content, and organize your notes. Complete comparison guide for students.",
    keywords: [
        "ai note taking app",
        "ai notes app",
        "best ai note taking app",
        "ai lecture notes",
        "automatic note taking app",
        "ai transcription app",
        "smart note taking",
        "ai study notes",
        "lecture transcription app",
        "ai note taker"
    ],
    openGraph: {
        title: "10 Best AI Note Taking Apps for Students in 2026",
        description: "Complete guide to AI-powered note taking apps. Compare features, pricing, and find your perfect study companion.",
        type: "article",
    },
    alternates: {
        canonical: "https://summarizelectures.com/blog/ai-note-taking-apps",
    },
};

const apps = [
    {
        rank: 1,
        name: "SummarizeLectures",
        tagline: "Best for Video Lectures",
        description: "Specializes in converting YouTube videos and lecture recordings into comprehensive study notes, flashcards, and quizzes.",
        pros: ["Works with any YouTube video", "Multiple output formats", "Free tier available", "Quiz generation"],
        cons: ["Focused on video content"],
        pricing: "Free, Pro $5/mo",
        rating: 4.9,
        isOurs: true,
    },
    {
        rank: 2,
        name: "Otter.ai",
        tagline: "Best for Live Transcription",
        description: "Real-time transcription for meetings and lectures with speaker identification and searchable transcripts.",
        pros: ["Live transcription", "Speaker labels", "Zoom integration"],
        cons: ["Limited free minutes", "No quiz generation"],
        pricing: "Free 300 min/mo, Pro $16.99/mo",
        rating: 4.5,
        isOurs: false,
    },
    {
        rank: 3,
        name: "Notion AI",
        tagline: "Best for Organization",
        description: "All-in-one workspace with AI writing assistance for summarizing, expanding, and organizing notes.",
        pros: ["Powerful organization", "AI writing help", "Templates"],
        cons: ["Learning curve", "AI costs extra"],
        pricing: "Free + AI $10/mo",
        rating: 4.7,
        isOurs: false,
    },
    {
        rank: 4,
        name: "Mem",
        tagline: "Best for Auto-Organization",
        description: "Self-organizing notes that automatically link related content using AI.",
        pros: ["Auto-links notes", "Smart search", "No folders needed"],
        cons: ["Can feel disorganized", "Premium pricing"],
        pricing: "Free, Pro $14.99/mo",
        rating: 4.3,
        isOurs: false,
    },
    {
        rank: 5,
        name: "Reflect",
        tagline: "Best for Networked Thinking",
        description: "AI-powered note-taking with backlinks and AI assistant for expanding ideas.",
        pros: ["Beautiful design", "Fast sync", "AI assistant"],
        cons: ["No free tier", "Mac/iOS only"],
        pricing: "$10/mo",
        rating: 4.4,
        isOurs: false,
    },
];

export default function AINoteTakingAppsPage() {
    return (
        <main className="min-h-screen">
            {/* Nav */}
            <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SummarizeLectures
                </Link>
                <Link href="/">
                    <Button variant="ghost" className="text-white hover:bg-white/10">← Back to Home</Button>
                </Link>
            </nav>

            {/* Hero */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
                    <Brain className="w-4 h-4" />
                    Updated January 2026
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    10 Best <span className="text-gradient">AI Note Taking Apps</span> for Students
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                    Stop typing everything manually. These AI-powered note taking apps automatically
                    transcribe, summarize, and organize your lecture notes so you can focus on learning.
                </p>
            </section>

            {/* Quick picks */}
            <section className="w-full max-w-4xl mx-auto px-6 py-8">
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                    <h2 className="font-bold text-lg mb-4">🏆 Quick Picks</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400">Best for Video Lectures:</p>
                            <p className="font-semibold text-purple-300">SummarizeLectures</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Best for Live Classes:</p>
                            <p className="font-semibold">Otter.ai</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Best for Organization:</p>
                            <p className="font-semibold">Notion AI</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="w-full max-w-4xl mx-auto px-6 py-8">
                <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4">What is an AI Note Taking App?</h2>
                    <p className="text-slate-300 text-lg">
                        An <strong>AI note taking app</strong> uses artificial intelligence to help you capture,
                        organize, and study from your notes more effectively. Unlike traditional note-taking
                        apps, AI-powered tools can automatically transcribe spoken words, summarize long
                        documents, generate flashcards, and even create study quizzes from your notes.
                    </p>
                    <p className="text-slate-300 text-lg mt-4">
                        For students, this means spending less time writing and more time understanding.
                        Whether you're in a live lecture or watching recorded content, these apps work
                        alongside you to ensure you never miss important information.
                    </p>
                </div>
            </section>

            {/* App Reviews */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">Detailed Reviews</h2>
                <div className="space-y-8">
                    {apps.map((app) => (
                        <article
                            key={app.rank}
                            className={`bg-white/5 border rounded-2xl p-8 ${app.isOurs ? 'border-purple-500/50 ring-1 ring-purple-500/20' : 'border-white/10'}`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-2xl font-bold text-purple-400">#{app.rank}</span>
                                        <h3 className="text-2xl font-bold">{app.name}</h3>
                                        {app.isOurs && (
                                            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                                Editor's Choice
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-400">{app.tagline}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">{app.rating}</span>
                                </div>
                            </div>

                            <p className="text-slate-300 mb-6">{app.description}</p>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-green-400 font-semibold mb-2">✓ Pros</p>
                                    <ul className="space-y-1">
                                        {app.pros.map((pro, i) => (
                                            <li key={i} className="text-slate-400 text-sm flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className="text-sm text-red-400 font-semibold mb-2">✗ Cons</p>
                                    <ul className="space-y-1">
                                        {app.cons.map((con, i) => (
                                            <li key={i} className="text-slate-400 text-sm">• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                                <p className="text-slate-400">Pricing: <span className="text-white font-semibold">{app.pricing}</span></p>
                                {app.isOurs && (
                                    <Link href="/">
                                        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 gap-2">
                                            Try Free <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Comparison table */}
            <section className="w-full max-w-5xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Quick Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white/5 rounded-xl overflow-hidden text-sm">
                        <thead>
                            <tr className="bg-white/10">
                                <th className="p-4 text-left">App</th>
                                <th className="p-4 text-center">Video Support</th>
                                <th className="p-4 text-center">Live Transcription</th>
                                <th className="p-4 text-center">Quiz Generation</th>
                                <th className="p-4 text-center">Free Tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-white/10 bg-purple-500/10">
                                <td className="p-4 font-semibold">SummarizeLectures</td>
                                <td className="p-4 text-center text-green-400">✓</td>
                                <td className="p-4 text-center text-slate-500">-</td>
                                <td className="p-4 text-center text-green-400">✓</td>
                                <td className="p-4 text-center text-green-400">✓</td>
                            </tr>
                            <tr className="border-t border-white/10">
                                <td className="p-4 font-semibold">Otter.ai</td>
                                <td className="p-4 text-center text-slate-500">-</td>
                                <td className="p-4 text-center text-green-400">✓</td>
                                <td className="p-4 text-center text-slate-500">-</td>
                                <td className="p-4 text-center text-green-400">✓</td>
                            </tr>
                            <tr className="border-t border-white/10">
                                <td className="p-4 font-semibold">Notion AI</td>
                                <td className="p-4 text-center text-slate-500">-</td>
                                <td className="p-4 text-center text-slate-500">-</td>
                                <td className="p-4 text-center text-slate-500">-</td>
                                <td className="p-4 text-center text-green-400">✓</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Note Taking?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Try SummarizeLectures free and see why students love AI-powered note taking.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-6 gap-2">
                            <Sparkles className="w-5 h-5" />
                            Try Free Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Related */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/blog/youtube-lecture-summarizer" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">Best YouTube Lecture Summarizer</h3>
                        <p className="text-slate-400 text-sm">Turn any YouTube video into study notes...</p>
                    </Link>
                    <Link href="/blog/best-ai-study-tools" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">Top 5 AI Study Tools</h3>
                        <p className="text-slate-400 text-sm">Complete guide to AI-powered studying...</p>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-white/10 mt-10">
                <p>© 2026 SummarizeLectures. All rights reserved.</p>
            </footer>

            {/* Schema */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": "10 Best AI Note Taking Apps for Students in 2026",
                    "author": { "@type": "Organization", "name": "SummarizeLectures" },
                    "datePublished": "2026-01-18"
                })
            }} />
        </main>
    );
}
