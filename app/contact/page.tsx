"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to your backend/email service
        console.log("Contact form submitted:", formData);
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-2xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="text-white mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>

                <h1 className="text-4xl font-bold mb-4 text-gradient">Contact Us</h1>
                <p className="text-slate-400 mb-8">
                    Have a question, feedback, or need help? We'd love to hear from you!
                </p>

                {submitted ? (
                    <Card className="bg-green-500/10 border-green-500/20">
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <Send className="h-8 w-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                            <p className="text-slate-300 mb-6">
                                Thanks for reaching out. We'll get back to you within 24-48 hours.
                            </p>
                            <Link href="/">
                                <Button className="btn-primary">Back to Home</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-400" />
                                Send us a message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-400 mb-1 block">Your Name</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 mb-1 block">Email Address</label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-1 block">Subject</label>
                                    <Input
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="How can we help?"
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-1 block">Message</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Describe your question or issue..."
                                        rows={5}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <Button type="submit" className="w-full btn-primary h-12">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <p className="text-sm text-slate-400 text-center">
                                    <Mail className="inline h-4 w-4 mr-1" />
                                    Or email us directly at: <span className="text-blue-400">support@summarizelectures.com</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}
