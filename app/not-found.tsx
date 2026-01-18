"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* 404 Content */}
            <div className="space-y-8 max-w-2xl">
                {/* Large 404 number */}
                <h1 className="text-[150px] md:text-[200px] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    404
                </h1>

                {/* Error message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-slate-400 max-w-md mx-auto">
                        Oops! The page you&apos;re looking for seems to have wandered off.
                        Don&apos;t worry, let&apos;s get you back on track.
                    </p>
                </div>

                {/* Helpful navigation links */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link href="/">
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 text-lg gap-2">
                            <Home className="w-5 h-5" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/pricing">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg gap-2">
                            <BookOpen className="w-5 h-5" />
                            View Pricing
                        </Button>
                    </Link>
                </div>

                {/* Additional helpful links */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-slate-400 mb-4">Or try one of these popular pages:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/#generate" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                            Generate Notes
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                            Dashboard
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                            Contact Us
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">
                            Privacy Policy
                        </Link>
                    </div>
                </div>

                {/* SEO-friendly text content */}
                <div className="pt-8 text-sm text-slate-500 max-w-lg mx-auto">
                    <p>
                        Looking for AI-powered lecture summarization? SummarizeLectures helps students
                        turn any YouTube lecture or video into structured study notes, cheat sheets,
                        flashcards, and quizzes in seconds. Head back to our homepage to get started!
                    </p>
                </div>
            </div>
        </main>
    );
}
