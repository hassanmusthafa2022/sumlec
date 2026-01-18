import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, HelpCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ - Frequently Asked Questions | SummarizeLectures",
    description: "Get answers to common questions about SummarizeLectures. Learn how our AI lecture summarizer works, pricing, supported formats, and more.",
    keywords: [
        "summarizelectures faq",
        "lecture summarizer questions",
        "ai summarizer help",
        "how does lecture summarizer work",
        "youtube summarizer faq"
    ],
    alternates: {
        canonical: "https://summarizelectures.com/faq",
    },
};

const faqs = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "What is SummarizeLectures?",
                a: "SummarizeLectures is an AI-powered tool that converts YouTube videos and lecture recordings into structured study materials. Simply paste a video URL, and our AI will generate summaries, cheat sheets, flashcards, quizzes, or mind maps instantly."
            },
            {
                q: "How does SummarizeLectures work?",
                a: "Our AI extracts the audio from your video, transcribes it using advanced speech recognition, then uses Google's Gemini AI to analyze the content and generate organized study materials. The entire process takes just seconds."
            },
            {
                q: "Is SummarizeLectures free to use?",
                a: "Yes! We offer a free tier that lets you summarize lectures with limited credits. For unlimited access and premium features, we offer affordable Pro and Premium plans starting at just $5/month."
            },
            {
                q: "Do I need to create an account?",
                a: "You can try the tool without an account, but creating a free account (via Google login) gives you access to save your summaries, track your usage, and unlock more features."
            },
        ]
    },
    {
        category: "Supported Content",
        questions: [
            {
                q: "What types of videos can I summarize?",
                a: "You can summarize any public YouTube video including university lectures, tutorials, podcasts, TED Talks, documentaries, and educational content. We also support video and audio file uploads for recorded lectures."
            },
            {
                q: "What video formats are supported for upload?",
                a: "We support MP4, MOV, AVI, and WebM video files, as well as MP3, WAV, and M4A audio files. Files must be under 100MB for the free tier or 500MB for Pro users."
            },
            {
                q: "Can I summarize videos in languages other than English?",
                a: "Currently, our AI works best with English content. We're actively working on adding support for Spanish, French, German, and other major languages."
            },
            {
                q: "Is there a maximum video length?",
                a: "Free users can summarize videos up to 30 minutes. Pro users can summarize videos up to 3 hours, and Premium users have no length limit."
            },
        ]
    },
    {
        category: "Output Formats",
        questions: [
            {
                q: "What output formats are available?",
                a: "You can generate: (1) Summary - comprehensive text notes, (2) Cheat Sheet - condensed one-page reference, (3) Flashcards - Q&A format for memorization, (4) Quiz - practice questions to test understanding, (5) Mind Map - visual concept diagram."
            },
            {
                q: "Can I download my summaries?",
                a: "Yes! All summaries can be downloaded as PDF files. You can also copy the content to your clipboard to paste into your favorite notes app like Notion, Google Docs, or Obsidian."
            },
            {
                q: "How accurate are the AI summaries?",
                a: "Our AI uses Google's Gemini technology, which provides highly accurate summaries. The AI understands context, identifies key concepts, and structures information logically. However, we always recommend reviewing the output for your specific needs."
            },
        ]
    },
    {
        category: "Pricing & Plans",
        questions: [
            {
                q: "What's included in the free tier?",
                a: "Free users get 3 credits per month, which allows you to summarize 3 lectures. Each credit includes all output formats (summary, cheat sheet, flashcards, quiz, mind map) for one video."
            },
            {
                q: "What's the difference between Pro and Premium?",
                a: "Pro ($5/month) includes 25 credits and longer video support. Premium ($15/month) includes 170 credits, unlimited video length, priority processing, and early access to new features."
            },
            {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time from your dashboard. You'll continue to have access until the end of your billing period."
            },
        ]
    },
    {
        category: "Technical",
        questions: [
            {
                q: "Is my data secure?",
                a: "Yes, we take security seriously. We use HTTPS encryption, and your summaries are stored securely. We don't share your data with third parties except as required to provide the service (e.g., Google for AI processing)."
            },
            {
                q: "Why isn't a specific video working?",
                a: "Some videos may not work due to: (1) The video is private or age-restricted, (2) Captions/transcripts are disabled, (3) The video is very long (exceeds your plan limit), (4) The audio quality is poor. Try a different video or contact support."
            },
            {
                q: "How do I contact support?",
                a: "You can reach us at support@summarizelectures.com or use the contact form on our website. We typically respond within 24 hours."
            },
        ]
    },
];

export default function FAQPage() {
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
                <HelpCircle className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Frequently Asked Questions
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                    Everything you need to know about SummarizeLectures. Can't find an answer?
                    <Link href="/contact" className="text-purple-400 hover:text-purple-300 ml-1">Contact us</Link>.
                </p>
            </section>

            {/* FAQ Sections */}
            <section className="w-full max-w-4xl mx-auto px-6 py-8">
                {faqs.map((section, i) => (
                    <div key={i} className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-purple-300">{section.category}</h2>
                        <div className="space-y-4">
                            {section.questions.map((faq, j) => (
                                <div key={j} className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="font-semibold text-lg mb-3">{faq.q}</h3>
                                    <p className="text-slate-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* CTA */}
            <section className="w-full max-w-4xl mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="text-slate-300 mb-6">
                        We're here to help! Reach out to our support team.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/contact">
                            <Button variant="outline" className="border-white/20 hover:bg-white/10">
                                Contact Support
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 gap-2">
                                <Sparkles className="w-4 h-4" />
                                Try SummarizeLectures
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-white/10 mt-10">
                <p>© 2026 SummarizeLectures. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                </div>
            </footer>

            {/* FAQ Schema for Rich Results */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.flatMap(section =>
                        section.questions.map(faq => ({
                            "@type": "Question",
                            "name": faq.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.a
                            }
                        }))
                    )
                })
            }} />
        </main>
    );
}
