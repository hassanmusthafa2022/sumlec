"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="text-white mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-8 text-gradient">Privacy Policy</h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6">
                    <p className="text-slate-300">Last updated: January 2026</p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                        <p className="text-slate-300">
                            When you use SummarizeLecture.ai, we collect:
                        </p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, and profile picture from your Google account when you sign in.</li>
                            <li><strong>Usage Data:</strong> YouTube URLs or files you upload for summarization.</li>
                            <li><strong>Generated Content:</strong> Summaries and notes we create for you, stored in your account.</li>
                            <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store card details.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
                        <p className="text-slate-300">We use your data to:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Provide the summarization service</li>
                            <li>Store your summary history for easy access</li>
                            <li>Process payments for premium features</li>
                            <li>Improve our AI and service quality</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">3. Data Storage & Security</h2>
                        <p className="text-slate-300">
                            Your data is stored securely using Firebase (Google Cloud). We use industry-standard encryption
                            and security practices to protect your information. Uploaded files are processed temporarily
                            and deleted after summarization.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">4. Third-Party Services</h2>
                        <p className="text-slate-300">We use the following third-party services:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li><strong>Google Firebase:</strong> Authentication and data storage</li>
                            <li><strong>Third-party AI Services:</strong> Content analysis and summarization</li>
                            <li><strong>Stripe:</strong> Payment processing</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">5. Your Rights</h2>
                        <p className="text-slate-300">You have the right to:</p>
                        <ul className="list-disc list-inside text-slate-300 space-y-2">
                            <li>Access your data</li>
                            <li>Delete your summaries from your library</li>
                            <li>Request account deletion</li>
                            <li>Export your data</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">6. Contact Us</h2>
                        <p className="text-slate-300">
                            If you have questions about this Privacy Policy, please contact us at{" "}
                            <Link href="/contact" className="text-blue-400 hover:underline">our contact page</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
