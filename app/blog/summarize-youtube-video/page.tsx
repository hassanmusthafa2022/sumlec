import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Youtube, Sparkles, ChevronRight, Clock, Zap, FileText, Download, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Summarize YouTube Video Free - AI Video Summarizer | Instant Notes",
    description: "Free AI tool to summarize any YouTube video in seconds. Get instant summaries, key points, and study notes from any video. No sign-up required to try.",
    keywords: [
        "summarize youtube video",
        "youtube video summarizer",
        "youtube summarizer",
        "summarize video",
        "video summary generator",
        "youtube summary",
        "video to text summary",
        "ai video summarizer",
        "youtube video summary",
        "video summarizer free"
    ],
    openGraph: {
        title: "Summarize Any YouTube Video Free - AI Summarizer",
        description: "Get instant summaries from any YouTube video. Free AI-powered video summarizer.",
        type: "article",
    },
    alternates: {
        canonical: "https://summarizelectures.com/blog/summarize-youtube-video",
    },
};

const benefits = [
    { icon: Clock, title: "Save 90% of Your Time", desc: "A 60-minute video summarized in 30 seconds" },
    { icon: Zap, title: "Instant Results", desc: "No waiting - get your summary immediately" },
    { icon: FileText, title: "Structured Output", desc: "Key points organized for easy reading" },
    { icon: Download, title: "Download as PDF", desc: "Save your summaries for offline study" },
];

export default function SummarizeYouTubeVideoPage() {
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
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm mb-6">
                    <Sparkles className="w-4 h-4" />
                    100% Free to Try
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    <span className="text-gradient">Summarize YouTube Video</span> in Seconds
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                    Paste any YouTube URL and get an instant AI-generated summary with key points,
                    main ideas, and actionable notes. Free to use, no sign-up required to try.
                </p>
                <Link href="/">
                    <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-6 gap-2">
                        <Youtube className="w-5 h-5" />
                        Summarize a Video Now - Free
                    </Button>
                </Link>
                <p className="text-sm text-slate-500 mt-4">Works with any public YouTube video</p>
            </section>

            {/* Benefits */}
            <section className="w-full max-w-5xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((b, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                            <b.icon className="w-10 h-10 text-green-400 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">{b.title}</h3>
                            <p className="text-slate-400 text-sm">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">How to Summarize a YouTube Video</h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
                            <h3 className="font-bold mb-2">Copy the URL</h3>
                            <p className="text-slate-400 text-sm">Find any YouTube video and copy its URL from the address bar</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
                            <h3 className="font-bold mb-2">Paste & Submit</h3>
                            <p className="text-slate-400 text-sm">Paste the URL into our summarizer and click Generate</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
                            <h3 className="font-bold mb-2">Get Your Summary</h3>
                            <p className="text-slate-400 text-sm">Receive an instant AI-generated summary with key points</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-invert max-w-none space-y-4">
                    <h2 className="text-2xl font-bold">Why Summarize YouTube Videos?</h2>
                    <p className="text-slate-300">
                        YouTube has become one of the largest educational platforms in the world, with millions
                        of lectures, tutorials, and courses available for free. However, watching long videos
                        can be time-consuming, especially when you only need the key information for studying
                        or quick reference.
                    </p>
                    <p className="text-slate-300">
                        Our AI-powered YouTube video summarizer solves this problem by extracting the most
                        important points from any video and presenting them in a clear, structured format.
                        Whether you're a student preparing for exams, a professional catching up on industry
                        content, or anyone who values their time, video summarization helps you learn faster.
                    </p>

                    <h2 className="text-2xl font-bold mt-8">What Types of Videos Can You Summarize?</h2>
                    <div className="grid md:grid-cols-2 gap-3 not-prose mt-4">
                        {[
                            "University lectures",
                            "Tutorial videos",
                            "Podcast episodes",
                            "Documentary films",
                            "TED Talks",
                            "Course content",
                            "Webinar recordings",
                            "Conference talks",
                            "Educational shows",
                            "Training videos"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-8 md:p-12 text-center">
                    <Youtube className="w-16 h-16 mx-auto mb-6 text-red-400" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Save Hours of Time?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Stop watching entire videos for just a few key points. Let AI do the heavy lifting.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-6 gap-2">
                            Summarize Your First Video <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Related */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/blog/youtube-lecture-summarizer" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">YouTube Lecture Summarizer</h3>
                        <p className="text-slate-400 text-sm">Best tool for lecture videos...</p>
                    </Link>
                    <Link href="/blog/ai-note-taking-apps" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">AI Note Taking Apps</h3>
                        <p className="text-slate-400 text-sm">Complete comparison guide...</p>
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
                    "@type": "HowTo",
                    "name": "How to Summarize a YouTube Video",
                    "description": "Step by step guide to summarizing any YouTube video using AI",
                    "step": [
                        { "@type": "HowToStep", "name": "Copy the video URL", "position": 1 },
                        { "@type": "HowToStep", "name": "Paste into SummarizeLectures", "position": 2 },
                        { "@type": "HowToStep", "name": "Get instant summary", "position": 3 }
                    ]
                })
            }} />
        </main>
    );
}
