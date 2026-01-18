"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="text-white mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-8 text-gradient">Terms of Service</h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6">
                    <p className="text-slate-300">Last updated: January 2026</p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                        <p className="text-slate-300">
                            By accessing and using SummarizeLectures, you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
                        <p className="text-slate-300">
                            SummarizeLectures provides an AI-powered service that generates summaries, notes, and study materials
                            from YouTube videos and uploaded media files. The service uses AI-powered analysis for content processing.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
                        <p className="text-slate-300">To use our service, you must:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Sign in with a valid Google account</li>
                            <li>Be at least 13 years of age</li>
                            <li>Provide accurate information</li>
                            <li>Keep your account credentials secure</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">4. Credits & Payments</h2>
                        <p className="text-slate-300">
                            New users receive 1 free credit. Additional credits can be purchased through our pricing plans.
                            Each summarization uses 1 credit. All payments are processed securely through Stripe.
                            Refunds may be considered on a case-by-case basis.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">5. Acceptable Use</h2>
                        <p className="text-slate-300">You agree not to:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Upload content that violates copyright laws</li>
                            <li>Use the service for illegal purposes</li>
                            <li>Attempt to reverse-engineer or exploit the service</li>
                            <li>Share your account with others</li>
                            <li>Abuse the service or overload our systems</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">6. Intellectual Property</h2>
                        <p className="text-slate-300">
                            You retain ownership of content you upload. Summaries generated are for your personal educational use.
                            The SummarizeLectures service, branding, and technology remain our intellectual property.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">7. Disclaimer</h2>
                        <p className="text-slate-300">
                            Our AI-generated summaries are provided "as-is" for educational purposes. We do not guarantee
                            accuracy, completeness, or suitability for any specific purpose. Always verify important
                            information from original sources.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">8. Limitation of Liability</h2>
                        <p className="text-slate-300">
                            SummarizeLectures shall not be liable for any indirect, incidental, or consequential damages
                            arising from your use of the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">9. Changes to Terms</h2>
                        <p className="text-slate-300">
                            We may update these terms at any time. Continued use after changes constitutes acceptance
                            of the new terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">10. Contact</h2>
                        <p className="text-slate-300">
                            For questions about these Terms, please visit our{" "}
                            <Link href="/contact" className="text-blue-400 hover:underline">contact page</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
