import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Brain, FileText, Zap, GraduationCap, Star } from "lucide-react";

export const metadata: Metadata = {
    title: "Top 5 Best AI Study Tools for Students in 2026 | Free & Paid",
    description: "Discover the best AI-powered study tools that help students summarize lectures, create flashcards, generate quizzes, and ace their exams. Comprehensive comparison guide.",
    keywords: [
        "best AI study tools",
        "AI tools for students",
        "lecture summarizer",
        "AI note taking",
        "study helper AI",
        "top AI education tools",
        "AI flashcard generator",
        "AI quiz maker",
        "student productivity tools",
        "online study tools",
        "best AI for studying",
        "AI learning tools 2026"
    ],
    openGraph: {
        title: "Top 5 Best AI Study Tools for Students in 2026",
        description: "Comprehensive guide to the best AI-powered study tools. Compare features, pricing, and find the perfect AI assistant for your studies.",
        type: "article",
        publishedTime: "2026-01-15T00:00:00Z",
        authors: ["SummarizeLectures Team"],
    },
    alternates: {
        canonical: "https://summarizelectures.com/blog/best-ai-study-tools",
    },
};

const aiTools = [
    {
        rank: 1,
        name: "SummarizeLectures",
        description: "The #1 AI-powered lecture summarization tool that transforms YouTube videos and lectures into structured study notes, flashcards, mind maps, and quizzes in seconds.",
        features: ["YouTube video summarization", "AI cheat sheets", "Flashcard generation", "Practice quizzes", "Mind map creation", "PDF export"],
        pricing: "Free tier available, Pro from $5/month",
        rating: 4.9,
        bestFor: "Students who watch online lectures and need quick, comprehensive summaries",
        url: "https://summarizelectures.com",
        isOurs: true,
    },
    {
        rank: 2,
        name: "Notion AI",
        description: "A versatile AI-enhanced workspace that helps with note-taking, summarization, and organization. Great for managing all your study materials in one place.",
        features: ["AI writing assistant", "Note organization", "Database templates", "Collaboration tools"],
        pricing: "AI add-on from $10/month",
        rating: 4.7,
        bestFor: "Students who want an all-in-one workspace for notes and projects",
        url: "https://notion.so",
        isOurs: false,
    },
    {
        rank: 3,
        name: "Quizlet",
        description: "A popular flashcard platform with AI-powered study modes. Excellent for memorization and spaced repetition learning.",
        features: ["Smart flashcards", "Practice tests", "Learn mode", "Match games"],
        pricing: "Free with ads, Plus from $7.99/month",
        rating: 4.6,
        bestFor: "Students focused on memorization and vocabulary",
        url: "https://quizlet.com",
        isOurs: false,
    },
    {
        rank: 4,
        name: "Otter.ai",
        description: "Real-time transcription AI that converts spoken lectures into searchable text. Perfect for recording live classes.",
        features: ["Live transcription", "Speaker identification", "Keyword search", "Audio playback sync"],
        pricing: "Free 300 min/month, Pro from $16.99/month",
        rating: 4.5,
        bestFor: "Students attending in-person or live online lectures",
        url: "https://otter.ai",
        isOurs: false,
    },
    {
        rank: 5,
        name: "Grammarly",
        description: "AI writing assistant that helps improve essays, papers, and written assignments with grammar, style, and clarity suggestions.",
        features: ["Grammar checking", "Plagiarism detection", "Tone adjustments", "Citation assistance"],
        pricing: "Free basic, Premium from $12/month",
        rating: 4.5,
        bestFor: "Students writing essays and research papers",
        url: "https://grammarly.com",
        isOurs: false,
    },
];

export default function BestAIStudyToolsPage() {
    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    SummarizeLectures
                </Link>
                <Link href="/">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                        ← Back to Home
                    </Button>
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16 text-center">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-6">
                    <Sparkles className="w-4 h-4" />
                    Updated for 2026
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                    Top 5 Best <span className="text-gradient">AI Study Tools</span> for Students
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                    Discover the most powerful AI-powered study tools that can help you learn faster,
                    retain more information, and ace your exams with less stress.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> For all students</span>
                    <span>•</span>
                    <span>Last updated: January 2026</span>
                    <span>•</span>
                    <span>5 min read</span>
                </div>
            </section>

            {/* Introduction */}
            <section className="w-full max-w-4xl mx-auto px-6 py-8">
                <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-slate-300 leading-relaxed">
                        The rise of artificial intelligence has revolutionized how students study and learn.
                        From <strong>AI lecture summarizers</strong> that can condense hours of video content into
                        digestible notes, to <strong>intelligent flashcard generators</strong> that optimize your
                        memorization, these tools are changing the game for students worldwide.
                    </p>
                    <p className="text-lg text-slate-300 leading-relaxed mt-4">
                        In this comprehensive guide, we've tested and compared the <strong>best AI study tools
                            available in 2026</strong>. Whether you're a college student drowning in lecture recordings
                        or a high schooler preparing for exams, there's a tool here that can transform your study routine.
                    </p>
                </div>
            </section>

            {/* Quick Comparison Table */}
            <section className="w-full max-w-5xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Quick Comparison</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white/5 rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-white/10">
                                <th className="p-4 text-left font-semibold">Tool</th>
                                <th className="p-4 text-left font-semibold">Best For</th>
                                <th className="p-4 text-left font-semibold">Pricing</th>
                                <th className="p-4 text-center font-semibold">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aiTools.map((tool) => (
                                <tr key={tool.rank} className={`border-t border-white/10 ${tool.isOurs ? 'bg-purple-500/10' : ''}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-purple-400 font-bold">#{tool.rank}</span>
                                            <span className="font-semibold">{tool.name}</span>
                                            {tool.isOurs && <span className="text-xs bg-purple-500 px-2 py-0.5 rounded-full">Our Pick</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300 text-sm">{tool.bestFor}</td>
                                    <td className="p-4 text-slate-300 text-sm">{tool.pricing}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span>{tool.rating}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Detailed Reviews */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold mb-10 text-center">Detailed Reviews</h2>
                <div className="space-y-12">
                    {aiTools.map((tool) => (
                        <article
                            key={tool.rank}
                            className={`bg-white/5 border rounded-2xl p-8 ${tool.isOurs ? 'border-purple-500/50 ring-1 ring-purple-500/20' : 'border-white/10'}`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl font-bold text-purple-400">#{tool.rank}</span>
                                        <h3 className="text-2xl font-bold">{tool.name}</h3>
                                        {tool.isOurs && (
                                            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                                Editor's Choice
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(tool.rating) ? 'fill-current' : 'fill-none'}`} />
                                        ))}
                                        <span className="text-white ml-2">{tool.rating}/5</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-400">Starting at</p>
                                    <p className="text-lg font-semibold text-green-400">{tool.pricing.split(',')[0]}</p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-lg mb-6">{tool.description}</p>

                            <div className="mb-6">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                    Key Features
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {tool.features.map((feature) => (
                                        <span key={feature} className="bg-white/10 px-3 py-1 rounded-full text-sm text-slate-300">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                {tool.isOurs ? (
                                    <Link href="/">
                                        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 gap-2">
                                            Try Free Now <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="border-white/20 hover:bg-white/10 gap-2">
                                            Visit Website <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </a>
                                )}
                                <span className="text-sm text-slate-400">Best for: {tool.bestFor}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center">
                    <Brain className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Study Sessions?
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of students who are already using SummarizeLectures to turn hours of lectures
                        into minutes of focused study time. Start for free today!
                    </p>
                    <Link href="/">
                        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-6 gap-2">
                            <Sparkles className="w-5 h-5" />
                            Start Summarizing Free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* FAQ Schema for SEO */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        {
                            q: "What is the best AI tool for studying?",
                            a: "SummarizeLectures is widely considered the best AI study tool for students who learn from video lectures. It combines lecture summarization, flashcard generation, quiz creation, and mind mapping in one powerful platform."
                        },
                        {
                            q: "Are AI study tools worth it for students?",
                            a: "Yes! AI study tools can save hours of note-taking time and help you retain information more effectively. Many students report significant improvements in their grades and reduced study stress after adopting AI tools."
                        },
                        {
                            q: "Can AI tools help with exam preparation?",
                            a: "Absolutely. AI study tools like SummarizeLectures can generate practice quizzes, flashcards, and cheat sheets that are specifically designed to help you prepare for exams efficiently."
                        },
                        {
                            q: "Is there a free AI study tool?",
                            a: "Yes, SummarizeLectures offers a free tier that allows you to summarize lectures and generate study materials at no cost. Premium features are available for more advanced users."
                        }
                    ].map((faq, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                            <p className="text-slate-300">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Articles */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/blog/how-to-study-effectively" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">How to Study Effectively with AI</h3>
                        <p className="text-slate-400 text-sm">Learn proven study techniques enhanced by AI tools...</p>
                    </Link>
                    <Link href="/" className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-colors group">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-300">Try SummarizeLectures Now</h3>
                        <p className="text-slate-400 text-sm">Start converting your lectures into study materials...</p>
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

            {/* JSON-LD Schema for Article */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Top 5 Best AI Study Tools for Students in 2026",
                        "description": "Comprehensive guide to the best AI-powered study tools including lecture summarizers, flashcard generators, and quiz makers.",
                        "author": {
                            "@type": "Organization",
                            "name": "SummarizeLectures"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "SummarizeLectures",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://summarizelectures.com/icon-512.png"
                            }
                        },
                        "datePublished": "2026-01-15",
                        "dateModified": "2026-01-18"
                    })
                }}
            />

            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is the best AI tool for studying?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "SummarizeLectures is widely considered the best AI study tool for students who learn from video lectures."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Are AI study tools worth it for students?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! AI study tools can save hours of note-taking time and help you retain information more effectively."
                                }
                            }
                        ]
                    })
                }}
            />
        </main>
    );
}
