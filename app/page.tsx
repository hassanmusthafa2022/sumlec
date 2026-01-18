"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, FileText, Download, Zap, CheckCircle } from "lucide-react";
import { Generator } from "@/components/Generator";
import { CheatSheetDisplay } from "@/components/CheatSheetDisplay";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/db";

export default function Home() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState("");
  const [videoTitle, setVideoTitle] = React.useState("");
  const [outputFormat, setOutputFormat] = React.useState("pdf");
  const [error, setError] = React.useState("");
  const [userPlan, setUserPlan] = React.useState<'free' | 'pro' | 'premium'>('free');

  React.useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(p => {
        if (p) setUserPlan(p.plan || 'free');
      });
    } else {
      setUserPlan('free');
    }
  }, [user]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      signInWithGoogle();
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, userId: user.uid }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (plan: 'pro' | 'premium') => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    const planDetails = {
      pro: { priceId: 'price_pro', credits: 25 },
      premium: { priceId: 'price_premium', credits: 170 }
    };
    const { priceId, credits } = planDetails[plan];

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
          credits,
          plan // Pass plan type to webhook
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout URL missing");
        alert("Payment initiation failed. Please try again.");
      }

    } catch (e) {
      console.error(e);
      alert("Payment initiation failed");
    }
  };



  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          SummarizeLectures
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/pricing">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Pricing</Button>
          </Link>
          {!user ? (
            <Button onClick={signInWithGoogle} variant="ghost" className="text-white hover:text-white hover:bg-white/10">Login</Button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden md:inline">Hi, {user.displayName?.split(" ")[0]}</span>
              <a href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Dashboard</Button>
              </a>
              <Button onClick={logout} variant="ghost" className="text-white hover:text-white hover:bg-white/10">Logout</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="generate" className="w-full flex-1 flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            Master Your Lectures in <span className="text-gradient">Seconds</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
            Turn any YouTube video or lecture recording into structured notes, cheat sheets, and summaries instantly with our Advanced AI.
          </p>

          <Generator
            onGenerate={(s, fmt, title) => { setSummary(s); setOutputFormat(fmt); setVideoTitle(title); }}
            onError={(e) => setError(e)}
            userPlan={userPlan}
          />

          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

          <p className="text-sm text-gray-400 mt-8">
            Join students making study time more efficient.
          </p>
        </div>
      </section>

      {/* Result Section (Only visible if summary exists) */}
      {summary && (
        <CheatSheetDisplay
          summary={summary}
          format={outputFormat}
          videoTitle={videoTitle || "Your Video"}
          onClose={() => setSummary("")}
        />
      )}

      {/* Features Grid */}
      {!summary && (
        <section className="w-full max-w-7xl mx-auto px-6 py-20 z-10">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Play, title: "Paste URL", desc: "Simply paste a YouTube link or upload your lecture video file." },
              { icon: Zap, title: "AI Analysis", desc: "Our AI engine transcribes and analyzes key concepts in seconds." },
              { icon: FileText, title: "Get Notes", desc: "Receive formatted summaries, cheat sheets, and quizzes instantly." }
            ].map((feature, i) => (
              <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-blue-400 mb-4" />
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-base">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Features / Why Choose Us */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 z-10 bg-gradient-to-b from-transparent to-black/30">
        <h2 className="text-3xl font-bold text-center mb-4">Why Students Love Us</h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">Everything you need to ace your exams, minus the stress.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🎬", title: "Upload Any Format", desc: "YouTube videos, PDFs, MP3s, MP4s — we handle it all." },
            { icon: "🧠", title: "AI-Powered Cheat Sheets", desc: "Key concepts, formulas, and definitions auto-extracted." },
            { icon: "📤", title: "Export Anywhere", desc: "Download your notes as PDF or Word documents." },
            { icon: "📝", title: "Quiz Yourself", desc: "Auto-generated quizzes to test your understanding." },
          ].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all hover:scale-105 group">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section className="w-full px-6 py-20 z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-4">See It In Action</h2>
          <p className="text-center text-slate-400 mb-12 max-w-xl">Here's a sneak peek of a generated cheat sheet.</p>
          <div className="w-full max-w-4xl rounded-xl border border-white/10 bg-black/50 shadow-2xl overflow-hidden">
            {/* Mock Cheat Sheet Preview */}
            <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-slate-400 font-mono">lecture-notes.md</span>
            </div>
            <div className="p-6 text-left space-y-4 font-mono text-sm text-slate-300">
              <p className="text-purple-400 font-bold"># Summary</p>
              <p className="text-slate-400">This lecture covers the fundamentals of quantum mechanics...</p>
              <p className="text-blue-400 font-bold mt-4">## Key Concepts</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Wave-Particle Duality</li>
                <li>Heisenberg Uncertainty Principle</li>
                <li>Schrödinger Equation</li>
              </ul>
              <p className="text-green-400 font-bold mt-4">## Quiz</p>
              <p className="text-slate-400">1. What is the significance of the double-slit experiment?</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - Adds more words and uses H1 keywords */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 z-10">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Master Your Lectures with AI-Powered Study Tools
          </h2>
          <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
            <p>
              <strong>SummarizeLectures</strong> is the ultimate AI-powered study companion designed to help you
              <strong> master your lectures in seconds</strong>. Whether you&apos;re watching a lengthy YouTube lecture,
              a recorded university class, or any educational video, our advanced AI technology transforms
              hours of content into concise, structured study materials instantly.
            </p>
            <p>
              Our intelligent lecture summarizer uses cutting-edge natural language processing to identify
              key concepts, important definitions, and critical formulas. Unlike traditional note-taking,
              which can be time-consuming and incomplete, SummarizeLectures ensures you never miss important
              information. The AI analyzes the entire lecture content and generates comprehensive notes,
              flashcards, mind maps, and even practice quizzes to test your understanding.
            </p>
            <p>
              Students from universities worldwide trust SummarizeLectures to streamline their study sessions.
              With support for multiple output formats including PDF downloads and cheat sheets, you can
              study anywhere, anytime. Our tool integrates seamlessly with{" "}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                YouTube
              </a>{" "}
              and other video platforms, making it effortless to convert any lecture into actionable study notes.
            </p>
            <p>
              Ready to transform your study experience? Start generating your first summary for free today.
              Check out our{" "}
              <Link href="/pricing" className="text-purple-400 hover:text-purple-300 underline">
                pricing plans
              </Link>{" "}
              for unlimited access or{" "}
              <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline">
                contact us
              </Link>{" "}
              if you have any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Social Sharing Section */}
      <section className="w-full max-w-4xl mx-auto px-6 py-10 z-10">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Share SummarizeLectures with your classmates:</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://twitter.com/intent/tweet?text=Check%20out%20SummarizeLectures%20-%20AI-powered%20lecture%20summarizer!&url=https://summarizelectures.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 rounded-lg text-[#1DA1F2] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              <span>Tweet</span>
            </a>
            <a
              href="https://www.linkedin.com/shareArticle?mini=true&url=https://summarizelectures.com&title=SummarizeLectures%20-%20AI%20Lecture%20Summarizer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/30 rounded-lg text-[#0A66C2] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://summarizelectures.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 rounded-lg text-[#1877F2] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer with more internal links */}
      <footer className="w-full py-12 text-center text-gray-500 text-sm z-10 border-t border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer navigation grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-left">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/#generate" className="hover:text-white transition-colors">Generate Notes</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog/best-ai-study-tools" className="hover:text-white transition-colors">Best AI Study Tools</Link></li>
                <li><Link href="/blog/how-to-study-effectively" className="hover:text-white transition-colors">Study Tips</Link></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube ↗</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="mailto:support@summarizelectures.com" className="hover:text-white transition-colors">Email Support</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10">
            <p>© 2026 SummarizeLectures. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
