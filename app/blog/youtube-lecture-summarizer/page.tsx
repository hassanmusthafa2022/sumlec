import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Youtube, Sparkles, CheckCircle, Clock, FileText, Brain, ChevronRight, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Best YouTube Lecture Summarizer - AI Video to Notes Converter | Free",
    description: "Turn any YouTube lecture into structured study notes in seconds. Free AI-powered YouTube lecture summarizer that creates summaries, flashcards, and quizzes automatically.",
    keywords: [
        "youtube lecture summarizer",
        "youtube video summarizer",
        "lecture summarizer",
        "youtube to notes",
        "summarize youtube lecture",
        "ai lecture summarizer",
        "video lecture notes",
        "youtube study notes",
        "lecture notes generator",
        "youtube transcript to notes"
    ],
    openGraph: {
        title: "Best YouTube Lecture Summarizer - Free AI Tool",
        description: "Turn any YouTube lecture into study notes, flashcards & quizzes in seconds. Free AI-powered summarizer.",
        type: "article",
    },
    alternates: {
        canonical: "https://summarizelectures.com/blog/youtube-lecture-summarizer",
    },
};

const features = [
    { icon: Youtube, title: "Paste Any YouTube URL", desc: "Works with any public YouTube video - lectures, tutorials, podcasts, and more" },
    { icon: Clock, title: "Save Hours of Time", desc: "Convert a 2-hour lecture into 5-minute study notes instantly" },
    { icon: FileText, title: "Multiple Output Formats", desc: "Get summaries, cheat sheets, flashcards, quizzes, or mind maps" },
    { icon: Brain, title: "AI-Powered Accuracy", desc: "Powered by Google Gemini AI for intelligent content understanding" },
];

const steps = [
    { step: 1, title: "Copy the YouTube URL", desc: "Find the lecture video you want to summarize and copy its URL from the browser" },
    { step: 2, title: "Paste into SummarizeLectures", desc: "Go to our homepage and paste the URL into the input field" },
    { step: 3, title: "Choose Your Format", desc: "Select whether you want a summary, cheat sheet, flashcards, quiz, or mind map" },
    { step: 4, title: "Download Your Notes", desc: "Get your AI-generated study materials in seconds, ready to download as PDF" },
];

export default function YouTubeLectureSummarizerPage() {
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
                <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm mb-6">
                    <Youtube className="w-4 h-4" />
                    Works with Any YouTube Video
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    The Best <span className="text-gradient">YouTube Lecture Summarizer</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                    Turn any YouTube lecture, tutorial, or educational video into structured study notes,
                    flashcards, and quizzes in seconds. 100% free to start.
                </p>
                <Link href="/">
                    <Button size="lg" className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-lg px-8 py-6 gap-2">
                        <Sparkles className="w-5 h-5" />
                        Summarize a Lecture Now - Free
                    </Button>
                </Link>
            </section>

            {/* What is section */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4">What is a YouTube Lecture Summarizer?</h2>
                    <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
                        <p>
                            A <strong>YouTube lecture summarizer</strong> is an AI-powered tool that automatically
                            extracts the key information from any YouTube video and converts it into organized study
                            materials. Instead of watching a 2-hour lecture and taking notes manually, you can get
                            comprehensive notes in just seconds.
                        </p>
                        <p>
                            SummarizeLectures uses advanced AI (powered by Google Gemini) to understand the context
                            of educational videos, identify important concepts, definitions, and formulas, and
                            structure them into formats optimized for learning and exam preparation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="w-full max-w-5xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">Why Choose Our YouTube Summarizer?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 flex gap-4">
                            <div className="bg-purple-500/20 p-3 rounded-xl h-fit">
                                <f.icon className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                                <p className="text-slate-400">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">How to Summarize a YouTube Lecture</h2>
                <div className="space-y-6">
                    {steps.map((s) => (
                        <div key={s.step} className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                                {s.step}
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="font-bold mb-2">{s.title}</h3>
                                <p className="text-slate-400">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Use cases */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Perfect For:</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        "University lectures on YouTube",
                        "Khan Academy videos",
                        "Coursera & edX content",
                        "MIT OpenCourseWare",
                        "TED Talks & TED-Ed",
                        "YouTube tutorials",
                        "Recorded Zoom lectures",
                        "Podcast episodes",
                        "Documentary films"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-slate-300">{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center">
                    <Youtube className="w-16 h-16 mx-auto mb-6 text-red-400" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Summarize Your First Lecture?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join students who are saving hours every week with AI-powered lecture summarization.
                        Start for free - no credit card required.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 text-lg px-8 py-6 gap-2">
                            Try Free Now <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Related */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/blog/best-ai-study-tools" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">Top 5 AI Study Tools for Students</h3>
                        <p className="text-slate-400 text-sm">Compare the best AI-powered study tools...</p>
                    </Link>
                    <Link href="/blog/how-to-study-effectively" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">How to Study Effectively with AI</h3>
                        <p className="text-slate-400 text-sm">Proven study techniques enhanced by AI...</p>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-white/10 mt-10">
                <p>© 2026 SummarizeLectures. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </div>
            </footer>

            {/* Schema */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": "Best YouTube Lecture Summarizer - AI Video to Notes Converter",
                    "description": "Turn any YouTube lecture into structured study notes in seconds with AI.",
                    "author": { "@type": "Organization", "name": "SummarizeLectures" },
                    "publisher": { "@type": "Organization", "name": "SummarizeLectures" },
                    "datePublished": "2026-01-18",
                    "dateModified": "2026-01-18"
                })
            }} />
        </main>
    );
}
