"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlashcardsSectionProps {
    summary: string;
}

interface Flashcard {
    front: string;
    back: string;
}

export function FlashcardsSection({ summary }: FlashcardsSectionProps) {
    const [currentCard, setCurrentCard] = useState(0);
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

    // Generate Flashcards
    const flashcards = useMemo((): Flashcard[] => {
        // 1. Try JSON First
        try {
            const jsonMatch = summary.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].front && parsed[0].back) {
                    return parsed.map((c: any) => ({ front: c.front, back: c.back }));
                }
            }
        } catch (e) { /* Fallback */ }

        // 2. Legacy Markdown
        const cards: Flashcard[] = [];
        const sections = summary.split(/(?=^## )/m).filter(s => s.trim());
        sections.forEach(section => {
            const titleMatch = section.match(/^## (.+)/m);
            if (!titleMatch) return;
            const title = titleMatch[1].replace(/[📚🎯📝❓📌⭐⚠️✅📊📈🧠⚡]/g, '').trim();
            const bullets = section.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
            if (bullets.length > 0) {
                // Create a card for the topic
                const mainPoint = bullets[0].replace(/^[-*]\s+/, '').split(':')[0];
                cards.push({ front: `What is ${title}?`, back: bullets[0].replace(/^[-*]\s+/, '') });
                // Create cards for key terms
                bullets.forEach(b => {
                    const match = b.match(/\*\*(.+?)\*\*/);
                    if (match) {
                        cards.push({ front: `What is ${match[1]}?`, back: b.replace(/\*\*.+?\*\*/, match[1]).replace(/^[-*]\s+/, '') });
                    }
                });
            }
        });
        return cards.slice(0, 30);
    }, [summary]);

    const activeCardData = flashcards[currentCard];

    // Card flip handler
    const handleFlip = (idx: number) => {
        setFlippedCards(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    };

    if (flashcards.length === 0) {
        return <div className="text-center p-8 text-gray-500">No flashcards generated.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] py-12">

            {/* 3D Card Container */}
            <div className="relative w-full max-w-2xl aspect-[3/2] perspective-1000 group">
                <div
                    onClick={() => handleFlip(currentCard)}
                    className={`w-full h-full relative text-center transition-all duration-500 transform-style-preserve-3d shadow-2xl rounded-2xl cursor-pointer ${flippedCards.has(currentCard) ? 'rotate-y-180' : ''}`}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-blue-400/50 transition-colors">
                        <div className="text-sm text-slate-400 font-mono tracking-widest mb-6">QUESTION</div>
                        <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">{activeCardData.front}</p>
                        <div className="absolute bottom-6 text-xs text-slate-500 animate-pulse">Click to flip</div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-900/20 to-purple-900/20 bg-slate-900 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center p-8">
                        <div className="text-sm text-purple-400 font-mono tracking-widest mb-6">ANSWER</div>
                        <p className="text-xl md:text-2xl text-white leading-relaxed">{activeCardData.back}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mt-12">
                <button
                    onClick={() => {
                        setFlippedCards(new Set()); // Reset Flip
                        setCurrentCard(Math.max(0, currentCard - 1));
                    }}
                    disabled={currentCard === 0}
                    className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 border border-white/10 text-white transition-all shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <div className="px-6 py-2 rounded-full bg-slate-800 border border-white/10 font-mono text-cyan-400">
                    {currentCard + 1} / {flashcards.length}
                </div>

                <button
                    onClick={() => {
                        setFlippedCards(new Set()); // Reset Flip
                        setCurrentCard(Math.min(flashcards.length - 1, currentCard + 1));
                    }}
                    disabled={currentCard === flashcards.length - 1}
                    className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 border border-white/10 text-white transition-all shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
