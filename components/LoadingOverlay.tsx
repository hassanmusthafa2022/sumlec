"use client";

import React, { useState, useEffect } from 'react';
import { Zap, BookOpen, Brain, Clock, Lightbulb } from 'lucide-react';

interface LoadingOverlayProps {
    isVisible: boolean;
    stage?: string;
}

const STUDY_TIPS = [
    "💡 Review your notes within 24 hours to boost retention by 80%",
    "🧠 The pomodoro technique: 25 minutes of focus, then a 5-minute break",
    "📝 Writing notes by hand helps you remember better than typing",
    "🎯 Teaching others is the best way to solidify your own understanding",
    "⏰ Spaced repetition is more effective than cramming",
    "🌙 Sleep helps consolidate memories - don't skip it before exams!",
    "📚 Active recall beats passive reading every time",
    "🎵 Instrumental music can help you focus while studying",
    "💪 Regular exercise improves cognitive function and memory",
    "🍎 Stay hydrated - even mild dehydration affects concentration",
];

export function LoadingOverlay({ isVisible, stage = "Processing..." }: LoadingOverlayProps) {
    const [tip, setTip] = useState(STUDY_TIPS[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            setProgress(0);
            return;
        }

        // Rotate tips every 4 seconds
        const tipInterval = setInterval(() => {
            setTip(STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)]);
        }, 4000);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(p => Math.min(95, p + Math.random() * 8));
        }, 500);

        return () => {
            clearInterval(tipInterval);
            clearInterval(progressInterval);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-4 text-center space-y-6">
                {/* Animated icon */}
                <div className="relative inline-flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full bg-purple-500/20 animate-ping" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <Brain className="h-10 w-10 text-white animate-pulse" />
                    </div>
                </div>

                {/* Status text */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Generating Your Study Guide</h2>
                    <p className="text-slate-400 flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        {stage}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Study tip */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-3 text-left">
                        <Lightbulb className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-500 mb-1">STUDY TIP</p>
                            <p className="text-sm text-slate-300">{tip}</p>
                        </div>
                    </div>
                </div>

                {/* Estimated time */}
                <p className="text-xs text-slate-500">
                    This usually takes 30-60 seconds depending on content length
                </p>
            </div>
        </div>
    );
}
