import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight, FileText, Brain, Zap, BookOpen, GraduationCap, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "AI Study Notes Generator - Create Notes from Videos Automatically",
    description: "Generate comprehensive study notes from any YouTube video or lecture automatically. AI-powered notes generator with flashcards, summaries, and quiz creation.",
    keywords: [
        "study notes generator",
        "notes generator",
        "ai notes generator",
        "automatic notes generator",
        "lecture notes generator",
        "study notes maker",
        "generate study notes",
        "ai study notes",
        "notes from video",
        "create notes automatically"
    ],
    openGraph: {
        title: "AI Study Notes Generator - Create Notes Automatically",
        description: "Generate comprehensive study notes from videos automatically with AI.",
        type: "article",
    },
    alternates: {
        canonical: "https://summarizelectures.com/blog/study-notes-generator",
    },
};

const outputTypes = [
    { icon: FileText, title: "Summary Notes", desc: "Comprehensive text summaries with all key information organized by topic" },
    { icon: BookOpen, title: "Cheat Sheets", desc: "Condensed one-page references perfect for quick review before exams" },
    { icon: Zap, title: "Flashcards", desc: "Question-and-answer format cards for active recall practice" },
    { icon: Brain, title: "Mind Maps", desc: "Visual diagrams showing relationships between concepts" },
    { icon: GraduationCap, title: "Practice Quizzes", desc: "Auto-generated questions to test your understanding" },
];

export default function StudyNotesGeneratorPage() {
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
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm mb-6">
                    <FileText className="w-4 h-4" />
                    AI-Powered
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    AI <span className="text-gradient">Study Notes Generator</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                    Automatically generate comprehensive study notes from any YouTube video, lecture,
                    or educational content. Save hours of note-taking with AI.
                </p>
                <Link href="/">
                    <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-lg px-8 py-6 gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate Notes Now - Free
                    </Button>
                </Link>
            </section>

            {/* Output types */}
            <section className="w-full max-w-5xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">What Kind of Notes Can You Generate?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outputTypes.map((o, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <o.icon className="w-10 h-10 text-orange-400 mb-4" />
                            <h3 className="font-bold text-lg mb-2">{o.title}</h3>
                            <p className="text-slate-400 text-sm">{o.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">How the Notes Generator Works</h2>
                <div className="space-y-6">
                    {[
                        { step: 1, title: "Input Your Content", desc: "Paste a YouTube URL or upload a video/audio file containing the lecture content" },
                        { step: 2, title: "AI Transcribes & Analyzes", desc: "Our AI extracts the audio, transcribes it, and identifies key concepts, definitions, and important information" },
                        { step: 3, title: "Choose Your Format", desc: "Select whether you want summary notes, cheat sheets, flashcards, mind maps, or quizzes" },
                        { step: 4, title: "Download & Study", desc: "Get your AI-generated study materials instantly, ready to download as PDF or copy to your notes app" },
                    ].map((s) => (
                        <div key={s.step} className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
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

            {/* Benefits */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Why Use an AI Notes Generator?</h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "Save 3-5 hours per lecture on note-taking",
                            "Never miss important concepts or definitions",
                            "Get structured, organized notes instantly",
                            "Multiple output formats for different study styles",
                            "Works with any educational video content",
                            "Perfect for visual, auditory, and kinesthetic learners",
                            "Export to PDF, Word, or any notes app",
                            "Study smarter, not harder"
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="text-slate-300">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-invert max-w-none space-y-4">
                    <h2 className="text-2xl font-bold">The Traditional Note-Taking Problem</h2>
                    <p className="text-slate-300">
                        Students spend an average of 6-8 hours per week just taking notes from lectures.
                        That's time that could be spent actually learning and understanding the material.
                        Traditional note-taking also has a major flaw: you're so focused on writing that
                        you often miss the bigger picture and fail to connect concepts.
                    </p>
                    <p className="text-slate-300">
                        An AI study notes generator solves both problems. It handles the tedious work of
                        capturing information while you focus on understanding. And because AI can process
                        the entire lecture at once, it identifies connections and structures the notes in
                        a way that enhances learning.
                    </p>

                    <h2 className="text-2xl font-bold mt-8">Perfect for These Scenarios</h2>
                    <ul className="text-slate-300 space-y-2">
                        <li>• <strong>Recorded lectures:</strong> Catch up on classes you missed</li>
                        <li>• <strong>YouTube courses:</strong> Learn from online education content</li>
                        <li>• <strong>Exam prep:</strong> Quickly review material before tests</li>
                        <li>• <strong>Language learning:</strong> Generate notes from foreign language content</li>
                        <li>• <strong>Research:</strong> Extract key points from academic talks</li>
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl p-8 md:p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-6 text-orange-400" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Start Generating Notes Automatically
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join students saving hours every week with AI-powered note generation.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-lg px-8 py-6 gap-2">
                            Try Free Now <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Related */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/blog/summarize-youtube-video" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">Summarize YouTube Video</h3>
                        <p className="text-slate-400 text-sm">Instant video summaries...</p>
                    </Link>
                    <Link href="/blog/how-to-study-effectively" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">How to Study Effectively</h3>
                        <p className="text-slate-400 text-sm">Proven study techniques...</p>
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
                    "@type": "SoftwareApplication",
                    "name": "SummarizeLectures Notes Generator",
                    "applicationCategory": "EducationalApplication",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                    "description": "AI-powered study notes generator that creates notes from YouTube videos automatically"
                })
            }} />
        </main>
    );
}
