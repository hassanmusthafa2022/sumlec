"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Zap, Upload, Youtube, X, FileText, GraduationCap, BookOpen, Target, ChevronDown, Plus, Globe, Presentation, GitBranch, Layers, HelpCircle, Lock, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveSummary, deductCredit } from "@/lib/db";
import { LoadingOverlay } from "./LoadingOverlay";

interface GeneratorProps {
    onGenerate: (summary: string, format: string, videoTitle: string) => void;
    onError: (error: string) => void;
    userPlan: 'free' | 'pro' | 'premium';
}

// Study modes configuration
const studyModes = {
    summary: { name: "📝 Summary", description: "Quick overview of key points", icon: BookOpen },
    deepDive: { name: "📚 Deep Dive", description: "Detailed explanations with examples", icon: FileText },
    examFocus: { name: "🎯 A+ in Exam", description: "Focused notes based on past papers", icon: Target },
};

// Output formats
const outputFormats = {
    pdf: { name: "📄 PDF Document", description: "Structured study notes", icon: FileText },
    slides: { name: "🎬 PowerPoint Slides", description: "Landscape presentation", icon: Presentation },
    mindmap: { name: "🧠 Mind Map", description: "Interactive branching diagram", icon: GitBranch },
    flashcards: { name: "🃏 Flashcards", description: "Flip cards for memorization", icon: Layers },
    quiz: { name: "❓ Quiz Mode", description: "Test your knowledge", icon: HelpCircle },
};

// Languages list (abbreviated for space)
const languages = [
    { code: "auto", name: "🌐 Auto-Detect", description: "Same as content" },
    { code: "en", name: "🇬🇧 English", description: "" },
    { code: "es", name: "🇪🇸 Spanish", description: "" },
    { code: "fr", name: "🇫🇷 French", description: "" },
    { code: "de", name: "🇩🇪 German", description: "" },
    { code: "zh", name: "🇨🇳 Chinese", description: "" },
    { code: "ja", name: "🇯🇵 Japanese", description: "" },
    { code: "ko", name: "🇰🇷 Korean", description: "" },
    { code: "ar", name: "🇸🇦 Arabic", description: "" },
    { code: "hi", name: "🇮🇳 Hindi", description: "" },
    { code: "ta", name: "🇮🇳 Tamil", description: "" },
    { code: "te", name: "🇮🇳 Telugu", description: "" },
    { code: "bn", name: "🇧🇩 Bengali", description: "" },
    { code: "ur", name: "🇵🇰 Urdu", description: "" },
    { code: "ru", name: "🇷🇺 Russian", description: "" },
    { code: "pt", name: "🇧🇷 Portuguese", description: "" },
    { code: "it", name: "🇮🇹 Italian", description: "" },
    { code: "tr", name: "🇹🇷 Turkish", description: "" },
    { code: "vi", name: "🇻🇳 Vietnamese", description: "" },
    { code: "th", name: "🇹🇭 Thai", description: "" },
    { code: "id", name: "🇮🇩 Indonesian", description: "" },
    { code: "nl", name: "🇳🇱 Dutch", description: "" },
    { code: "pl", name: "🇵🇱 Polish", description: "" },
    { code: "uk", name: "🇺🇦 Ukrainian", description: "" },
    { code: "si", name: "🇱🇰 Sinhala", description: "" },
];

type StudyMode = keyof typeof studyModes;
type OutputFormat = keyof typeof outputFormats;

export function Generator({ onGenerate, onError, userPlan }: GeneratorProps) {
    const { user, signInWithGoogle } = useAuth();

    // Plan Limits
    const PLAN_LIMITS = {
        free: { files: 2, features: ['summary', 'deepDive', 'examFocus', 'pdf', 'slides'] },
        pro: { files: 6, features: ['all'] },
        premium: { files: 10, features: ['all'] }
    };

    const currentLimit = PLAN_LIMITS[userPlan] || PLAN_LIMITS.free;
    const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
    const [url, setUrl] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [pastPapers, setPastPapers] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [studyMode, setStudyMode] = useState<StudyMode>('summary');
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('pdf');
    const [language, setLanguage] = useState("auto");
    const [showModeMenu, setShowModeMenu] = useState(false);
    const [showFormatMenu, setShowFormatMenu] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [loadingStage, setLoadingStage] = useState("Processing...");
    const formRef = useRef<HTMLFormElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut: Ctrl/Cmd + Enter to submit
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !loading) {
                e.preventDefault();
                formRef.current?.requestSubmit();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [loading]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                closeAllMenus();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const incoming = Array.from(newFiles);
        if (files.length + incoming.length > currentLimit.files) {
            onError(`Upgrade required. Your ${userPlan} plan is limited to ${currentLimit.files} files.`);
            return;
        }
        setFiles([...files, ...incoming].slice(0, currentLimit.files));
    };

    const handleRemoveFile = (index: number) => setFiles(files.filter((_, i) => i !== index));
    const handleAddPastPaper = (newFiles: FileList | null) => {
        if (!newFiles) return;
        setPastPapers([...pastPapers, ...Array.from(newFiles)].slice(0, 3));
    };
    const handleRemovePastPaper = (index: number) => setPastPapers(pastPapers.filter((_, i) => i !== index));

    const closeAllMenus = () => { setShowModeMenu(false); setShowFormatMenu(false); setShowLangMenu(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { signInWithGoogle(); return; }

        setLoading(true);
        setLoadingStage("Preparing...");
        onError("");

        try {
            const formData = new FormData();
            formData.append("userId", user.uid);
            formData.append("mode", studyMode);
            formData.append("language", language);
            formData.append("outputFormat", outputFormat);

            if (activeTab === 'url') {
                if (!url) throw new Error("Please enter a YouTube URL");
                formData.append("url", url);
                setLoadingStage("Downloading audio from YouTube...");
            } else {
                if (files.length === 0) throw new Error("Please select at least one file");
                files.forEach((file, idx) => formData.append(`file${idx}`, file));
                formData.append("fileCount", files.length.toString());
                setLoadingStage("Uploading files...");
            }

            if (studyMode === 'examFocus' && pastPapers.length > 0) {
                pastPapers.forEach((paper, idx) => formData.append(`pastPaper${idx}`, paper));
                formData.append("pastPaperCount", pastPapers.length.toString());
            }

            setLoadingStage("AI is analyzing content...");

            // Deduct Credit (Client-side to ensure Auth context)
            const hasCredit = await deductCredit(user.uid);
            if (!hasCredit) {
                throw new Error("Insufficient credits. Please upgrade to continue.");
            }

            const res = await fetch("/api/summarize", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate");

            // Save to Firestore from client (has proper auth context)
            try {
                await saveSummary(user.uid, {
                    videoId: data.videoId || '',
                    videoUrl: data.videoUrl || '',
                    videoTitle: data.videoTitle || 'Untitled',
                    summaryContent: data.summary || '',
                    outputFormat: outputFormat,
                });
            } catch (saveErr) {
                console.error("Failed to save to history:", saveErr);
                // Continue even if save fails - user still gets their summary
            }

            onGenerate(data.summary, outputFormat, data.videoTitle);
            if (activeTab === 'file') { setFiles([]); setPastPapers([]); }

        } catch (err: any) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentMode = studyModes[studyMode];
    const currentFormat = outputFormats[outputFormat];
    const currentLang = languages.find(l => l.code === language) || languages[0];
    const ModeIcon = currentMode.icon;
    const FormatIcon = currentFormat.icon;

    return (
        <>
            <LoadingOverlay isVisible={loading} stage={loadingStage} />
            <Card className="w-full max-w-3xl mx-auto p-1 bg-black/40 border-white/10 backdrop-blur-xl">
                {/* Tabs */}
                <div className="flex p-2 gap-2">
                    <Button variant="ghost" onClick={() => setActiveTab('url')} className={`flex-1 ${activeTab === 'url' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                        <Youtube className="mr-2 h-4 w-4" /> YouTube
                    </Button>
                    <Button variant="ghost" onClick={() => setActiveTab('file')} className={`flex-1 ${activeTab === 'file' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Files
                    </Button>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
                    {/* Row 1: Study Mode, Output Format, Language */}
                    <div ref={dropdownRef} className="grid grid-cols-3 gap-2 relative z-[100]">
                        {/* Study Mode */}
                        <div className="relative">
                            <label className="text-[10px] text-gray-400 mb-0.5 block">Study Mode</label>
                            <button type="button" onClick={() => { closeAllMenus(); setShowModeMenu(true); }}
                                className="w-full flex items-center justify-between gap-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 text-sm">
                                <div className="flex items-center gap-1.5 truncate">
                                    <ModeIcon className="h-4 w-4 text-purple-400 shrink-0" />
                                    <span className="truncate">{currentMode.name.split(' ')[1]}</span>
                                </div>
                                <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                            </button>
                            {showModeMenu && (
                                <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                                    {Object.entries(studyModes).map(([key, mode]) => {
                                        const Icon = mode.icon;
                                        return (
                                            <button key={key} type="button" onClick={() => { setStudyMode(key as StudyMode); setShowModeMenu(false); }}
                                                className={`w-full flex items-center gap-2 p-2.5 text-left hover:bg-slate-700 ${studyMode === key ? 'bg-purple-500/20' : ''}`}>
                                                <Icon className={`h-4 w-4 ${studyMode === key ? 'text-purple-400' : 'text-gray-400'}`} />
                                                <div>
                                                    <div className={`text-sm ${studyMode === key ? 'text-purple-400' : 'text-white'}`}>{mode.name}</div>
                                                    <div className="text-[10px] text-gray-400">{mode.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Output Format */}
                        <div className="relative">
                            <label className="text-[10px] text-gray-400 mb-0.5 block">Output Format</label>
                            <button type="button" onClick={() => { closeAllMenus(); setShowFormatMenu(true); }}
                                className="w-full flex items-center justify-between gap-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 text-sm">
                                <div className="flex items-center gap-1.5 truncate">
                                    <FormatIcon className="h-4 w-4 text-cyan-400 shrink-0" />
                                    <span className="truncate">{currentFormat.name.split(' ')[1]}</span>
                                </div>
                                <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                            </button>
                            {showFormatMenu && (
                                <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                                    {Object.entries(outputFormats).map(([key, format]) => {
                                        const Icon = format.icon;
                                        const isLocked = userPlan === 'free' && ['flashcards', 'quiz', 'mindmap'].includes(key);
                                        return (
                                            <button key={key} type="button"
                                                onClick={() => {
                                                    if (!isLocked) {
                                                        setOutputFormat(key as OutputFormat);
                                                        setShowFormatMenu(false);
                                                    }
                                                }}
                                                disabled={isLocked}
                                                className={`w-full flex items-center justify-between gap-2 p-2.5 text-left hover:bg-slate-700 ${outputFormat === key ? 'bg-cyan-500/20' : ''} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className={`h-4 w-4 ${outputFormat === key ? 'text-cyan-400' : 'text-gray-400'}`} />
                                                    <div>
                                                        <div className={`text-sm ${outputFormat === key ? 'text-cyan-400' : 'text-white'}`}>{format.name}</div>
                                                        <div className="text-[10px] text-gray-400">{format.description}</div>
                                                    </div>
                                                </div>
                                                {isLocked && <Lock className="h-3 w-3 text-slate-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Language */}
                        <div className="relative">
                            <label className="text-[10px] text-gray-400 mb-0.5 block">Language</label>
                            <button type="button" onClick={() => { closeAllMenus(); setShowLangMenu(true); }}
                                className="w-full flex items-center justify-between gap-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 text-sm">
                                <div className="flex items-center gap-1.5 truncate">
                                    <Globe className="h-4 w-4 text-green-400 shrink-0" />
                                    <span className="truncate">{currentLang.name.split(' ')[1] || 'Auto'}</span>
                                </div>
                                <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                            </button>
                            {showLangMenu && (
                                <div className="absolute top-full left-0 right-0 z-[100] mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                                    {languages.map((lang) => (
                                        <button key={lang.code} type="button" onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-700 text-sm ${language === lang.code ? 'bg-green-500/20 text-green-400' : 'text-white'}`}>
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Input */}
                    {activeTab === 'url' ? (
                        <Input placeholder="Paste YouTube Video URL..." className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 focus:bg-white/15"
                            value={url} onChange={(e) => setUrl(e.target.value)} disabled={loading} />
                    ) : (
                        <div className="space-y-2">
                            {files.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 bg-purple-500/20 px-2 py-1 rounded-full text-xs text-white">
                                            <FileText className="h-3 w-3 text-purple-400" />
                                            <span className="max-w-[100px] truncate">{file.name}</span>
                                            <button type="button" onClick={() => handleRemoveFile(idx)} className="text-gray-400 hover:text-white"><X className="h-3 w-3" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {files.length < 5 && (
                                <label className="flex items-center justify-center gap-2 p-3 bg-white/5 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-purple-500/50 cursor-pointer">
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">{files.length === 0 ? 'Choose Files' : 'Add More'}</span>
                                    <input type="file" multiple accept=".pdf,.mp4,.mp3,.wav,.m4a,.jpg,.jpeg,.png" className="hidden"
                                        onChange={(e) => handleAddFiles(e.target.files)} disabled={loading} />
                                </label>
                            )}
                        </div>
                    )}

                    {/* Past Papers for Exam Mode */}
                    {studyMode === 'examFocus' && (
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-yellow-400" />
                                <span className="text-white text-sm font-medium">Past Papers (Optional)</span>
                            </div>
                            {pastPapers.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {pastPapers.map((paper, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 bg-yellow-500/20 px-2 py-1 rounded-full text-xs text-white">
                                            <FileText className="h-3 w-3 text-yellow-400" />
                                            <span className="max-w-[100px] truncate">{paper.name}</span>
                                            <button type="button" onClick={() => handleRemovePastPaper(idx)} className="text-gray-400 hover:text-white"><X className="h-3 w-3" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {pastPapers.length < 3 && (
                                <label className="flex items-center justify-center gap-1 p-2 bg-white/5 border border-dashed border-yellow-500/30 rounded-lg text-gray-400 hover:text-white text-sm cursor-pointer">
                                    <Plus className="h-3 w-3" />
                                    <span>{pastPapers.length === 0 ? 'Upload Past Paper' : 'Add More'}</span>
                                    <input type="file" multiple accept=".pdf" className="hidden" onChange={(e) => handleAddPastPaper(e.target.files)} disabled={loading} />
                                </label>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <Button size="lg" className="h-12 w-full text-base btn-primary hover:scale-[1.02] transition-transform" disabled={loading}>
                        {loading ? <span className="animate-spin mr-2">⟳</span> : <Zap className="mr-2 h-5 w-5" />}
                        {loading ? "Generating..." : `Generate ${currentFormat.name.split(' ')[1]}`}
                    </Button>
                </form>
            </Card>
        </>
    );
}
