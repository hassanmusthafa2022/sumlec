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
        console.warn("Stripe fallback");
        if (confirm(`Stripe not configured. Mock Purchase for ${plan.toUpperCase()}?`)) {
          const { mockProcessPayment } = await import("@/lib/stripe-dummy");
          const { addCredits, updateUserPlan } = await import("@/lib/db");

          await mockProcessPayment(user.uid, priceId);
          await addCredits(user.uid, credits);

          if (updateUserPlan) await updateUserPlan(user.uid, plan);

          alert(`Mock Success! ${credits} Credits added & Plan updated to ${plan}.`);
          window.location.href = "/dashboard";
        }
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
          SummarizeLecture.ai
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
            Turn any YouTube video or lecture recording into structured notes, cheat sheets, and summaries instantly with Gemini 2.5 AI.
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
              { icon: Zap, title: "AI Analysis", desc: "Gemini 2.5 Flash transcribes and analyzes key concepts in seconds." },
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

      {/* Pricing Removed - Moved to /pricing */}

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-500 text-sm z-10 border-t border-white/10 mt-10">
        <div className="flex justify-center gap-6 mb-4">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p>© 2026 SummarizeLecture.ai. All rights reserved.</p>
      </footer>
    </main>
  );
}
