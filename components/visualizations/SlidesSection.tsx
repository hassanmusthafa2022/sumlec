"use client";

import React, { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Presentation,
    BookOpen, Cpu, Network, Database, Code, Brain, Lightbulb, Target,
    CheckCircle, HelpCircle, Layers, Settings, Zap, Globe, Radio,
    Binary, Power, Truck, Server, Shield, Wifi, HardDrive, Monitor,
    FileCode, Terminal, ToggleLeft, Mail, Lock, Cloud, Signal, FileText,
    Waves, Calculator, GitBranch, List, Table, BarChart3, PieChart
} from "lucide-react";


interface SlidesSectionProps {
    summary: string;
    displayTitle: string;
}

interface SlideData {
    title: string;
    subtitle?: string;
    bullets: { text: string; highlight?: string }[];
    type: 'title' | 'content' | 'cards' | 'comparison';
    layout: 'icon' | 'code' | 'cards' | 'table' | 'comparison' | 'plain';
    icon: string;
    imageSearchQuery?: string;
    imageUrl?: string;
    codeBlock?: string;
    cards?: { title: string; text: string }[];
    tableData?: { headers: string[]; rows: string[][] };
    comparison?: { leftTitle: string; rightTitle: string; leftPoints: string[]; rightPoints: string[] };
    speakerNotes?: string;
}

const getIconForTopic = (title: string, content?: string): string => {
    const text = (title + ' ' + (content || '')).toLowerCase();
    if (/network|lan|wan|internet|tcp|ip|router|ethernet|packet/.test(text)) return 'network';
    if (/osi|layer|protocol|http|ftp|dns/.test(text)) return 'layers';
    if (/wireless|wifi|bluetooth|radio|frequency/.test(text)) return 'wifi';
    if (/signal|wave|modulation|amplitude|carrier/.test(text)) return 'signal';
    if (/mail|email|smtp|letter|send|message/.test(text)) return 'mail';
    if (/cpu|processor|alu|register|fetch|decode|execute/.test(text)) return 'cpu';
    if (/memory|ram|rom|cache|storage|disk|ssd|hdd/.test(text)) return 'database';
    if (/server|host|client|mainframe/.test(text)) return 'server';
    if (/display|monitor|screen|output|gpu/.test(text)) return 'monitor';
    if (/binary|bit|byte|switch|0|1|base.?2/.test(text)) return 'binary';
    if (/power|electric|voltage|circuit/.test(text)) return 'power';
    if (/code|program|algorithm|function|variable|loop/.test(text)) return 'code';
    if (/assembly|instruction|mov|load|store|add/.test(text)) return 'terminal';
    if (/compile|interpret|syntax|debug/.test(text)) return 'filecode';
    if (/git|version|branch|merge/.test(text)) return 'git';
    if (/table|comparison|compare|vs|versus|difference/.test(text)) return 'table';
    if (/chart|graph|statistic|data|analysis/.test(text)) return 'chart';
    if (/list|overview|summary|introduction|key|concept/.test(text)) return 'list';
    if (/calculate|math|formula|equation|compute/.test(text)) return 'calculator';
    if (/security|encrypt|decrypt|password|auth|firewall/.test(text)) return 'shield';
    if (/cloud|aws|azure|docker|kubernetes/.test(text)) return 'cloud';
    if (/lock|key|certificate|ssl|tls/.test(text)) return 'lock';
    if (/setting|config|option|preference/.test(text)) return 'settings';
    if (/quiz|question|test|exam|answer|practice/.test(text)) return 'help';
    if (/tip|hint|remember|important|note/.test(text)) return 'lightbulb';
    if (/goal|target|objective|aim/.test(text)) return 'target';
    if (/check|correct|right|success/.test(text)) return 'check';
    if (/global|world|international/.test(text)) return 'globe';
    if (/fast|speed|quick|performance/.test(text)) return 'zap';
    if (/book|read|learn|study/.test(text)) return 'book';
    return 'zap';
};

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const icons: Record<string, React.ReactNode> = {
        cpu: <Cpu className={className} />, network: <Network className={className} />,
        database: <Database className={className} />, code: <Code className={className} />,
        brain: <Brain className={className} />, lightbulb: <Lightbulb className={className} />,
        target: <Target className={className} />, help: <HelpCircle className={className} />,
        layers: <Layers className={className} />, settings: <Settings className={className} />,
        zap: <Zap className={className} />, globe: <Globe className={className} />,
        book: <BookOpen className={className} />, check: <CheckCircle className={className} />,
        binary: <Binary className={className} />, power: <Power className={className} />,
        truck: <Truck className={className} />, server: <Server className={className} />,
        shield: <Shield className={className} />, wifi: <Wifi className={className} />,
        drive: <HardDrive className={className} />, monitor: <Monitor className={className} />,
        terminal: <Terminal className={className} />, filecode: <FileCode className={className} />,
        toggle: <ToggleLeft className={className} />, mail: <Mail className={className} />,
        lock: <Lock className={className} />, cloud: <Cloud className={className} />,
        signal: <Signal className={className} />, waves: <Waves className={className} />,
        radio: <Radio className={className} />, calculator: <Calculator className={className} />,
        git: <GitBranch className={className} />, list: <List className={className} />,
        table: <Table className={className} />, chart: <BarChart3 className={className} />,
        pie: <PieChart className={className} />,
    };
    return <>{icons[name] || <Zap className={className} />}</>;
};

const renderBold = (text: string) => {
    if (!text) return null;
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ?
            <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong> :
            <span key={i}>{part}</span>
    );
};

export function SlidesSection({ summary, displayTitle }: SlidesSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);


    // Parse slides - NOW HANDLES BOTH JSON AND LEGACY MARKDOWN
    const slides = useMemo((): SlideData[] => {
        const MAX_SLIDES = 45;

        // 1. Try parsing strictly as JSON first
        try {
            const jsonMatch = summary.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((s: any) => ({
                        title: s.title || "Slide",
                        subtitle: s.subtitle,
                        bullets: Array.isArray(s.bullets) ? s.bullets.map((b: string) => typeof b === 'string' ? { text: b } : b) : [],
                        speakerNotes: s.speakerNotes,
                        type: s.type || 'content',
                        layout: s.layout || 'plain',
                        icon: s.icon || getIconForTopic(s.title || ""),
                        imageSearchQuery: s.imageSearchQuery,
                        cards: s.cards,
                        tableData: s.tableData,
                        comparison: s.comparison,
                        codeBlock: s.codeBlock
                    })).filter((slide: SlideData) => {
                        // Keep title slides
                        if (slide.type === 'title') return true;
                        // Keep slides that have actual content
                        const hasBullets = slide.bullets && slide.bullets.length > 0;
                        const hasCards = slide.cards && slide.cards.length > 0;
                        const hasComparison = !!slide.comparison;
                        const hasCode = !!slide.codeBlock;
                        const hasTable = !!slide.tableData;
                        return hasBullets || hasCards || hasComparison || hasCode || hasTable;
                    });
                }
            }
        } catch (e) {
            console.log("Not JSON slides, using markdown parser");
        }

        // 2. Legacy Markdown Parsing (Fallback)
        const result: SlideData[] = [];
        result.push({ title: displayTitle, subtitle: 'AI-Generated Study Guide', bullets: [], type: 'title', layout: 'plain', icon: 'book' });

        const sections = summary.split(/(?=^## )/m).filter(s => s.trim());

        sections.forEach((section, idx) => {
            if (result.length >= MAX_SLIDES) return;

            const titleMatch = section.match(/^## (.+)/m);
            const rawTitle = titleMatch ? titleMatch[1].replace(/[📚🎯📝❓📌⭐⚠️✅📊📈🧠⚡]/g, '').trim() : 'Topic';

            const allBullets: { text: string; highlight?: string }[] = [];
            const lines = section.split('\n').slice(1);
            let hasTable = false;
            let codeBlock = '';

            lines.forEach(line => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) return;
                if (trimmed.startsWith('|')) hasTable = true;
                if (trimmed.startsWith('```')) return;
                if (/^(LOAD|MOV|ADD|SUB|MUL|STORE|JMP)\s/.test(trimmed)) { codeBlock += trimmed + '\n'; return; }

                if (/^[-*]\s+/.test(trimmed)) {
                    let text = trimmed.replace(/^[-*]\s+/, '');
                    let highlight = '';
                    const boldMatch = text.match(/^\*\*(.+?)\*\*[:\s]*(.*)/);
                    if (boldMatch) { highlight = boldMatch[1]; text = boldMatch[2] || boldMatch[1]; }
                    if (text.length > 2) allBullets.push({ text: text.replace(/\*\*/g, ''), highlight });
                } else if (/^\d+\.\s+/.test(trimmed)) {
                    const text = trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '');
                    if (text.length > 2) allBullets.push({ text });
                } else if (/^[A-D]\)\s+/.test(trimmed)) {
                    const text = trimmed.replace(/^[A-D]\)\s+/, '').replace(/\*\*/g, '');
                    if (text.length > 2) allBullets.push({ text });
                }
            });

            if (allBullets.length === 0 && !codeBlock && !hasTable) return;

            const icon = getIconForTopic(rawTitle, section);
            let layout: 'icon' | 'code' | 'cards' | 'table' | 'plain' = 'plain';
            if (codeBlock) layout = 'code';
            else if (hasTable) layout = 'table';
            else if (allBullets.length >= 4 && allBullets.length <= 6 && idx % 3 === 0) layout = 'cards';
            else if (allBullets.length > 0 && idx % 2 === 0) layout = 'icon';

            const bulletsPerSlide = 8;
            for (let i = 0; i < allBullets.length && result.length < MAX_SLIDES; i += bulletsPerSlide) {
                const chunk = allBullets.slice(i, i + bulletsPerSlide);
                if (chunk.length > 0) {
                    let cards: { title: string; text: string }[] | undefined;
                    if (layout === 'cards' && i === 0) {
                        cards = chunk.slice(0, 4).map(b => ({ title: b.highlight || b.text.split(' ').slice(0, 3).join(' '), text: b.text }));
                    }
                    result.push({ title: rawTitle, bullets: chunk, type: 'content', layout: i === 0 ? layout : (idx % 2 === 0 ? 'icon' : 'plain'), icon, codeBlock: layout === 'code' && i === 0 ? codeBlock : undefined, cards });
                }
            }
        });
        return result.slice(0, 50);
    }, [summary, displayTitle]);

    const activeSlideData = slides[currentSlide] || slides[0];

    // Pre-compute icons for ALL slides in one pass (memoized)
    const slideIcons = useMemo(() => {
        const iconMap: Record<string, any> = {
            'code': Code, 'program': Terminal, 'develop': FileCode, 'algorithm': GitBranch,
            'data': Database, 'server': Server, 'cloud': Cloud, 'network': Network,
            'api': Globe, 'connect': Wifi, 'cyber': Shield, 'security': Lock,
            'math': Calculator, 'calc': Calculator, 'stat': BarChart3, 'analy': PieChart,
            'brain': Brain, 'ai': Brain, 'intelligen': Brain, 'learn': BookOpen,
            'logic': Cpu, 'process': Cpu, 'compute': HardDrive, 'electr': Zap,
            'mechan': Settings, 'eng': Settings, 'build': Layers, 'struct': Layers,
            'target': Target, 'goal': Target, 'object': Target, 'plan': List,
            'check': CheckCircle, 'done': CheckCircle, 'success': CheckCircle,
            'question': HelpCircle, 'why': HelpCircle, 'how': HelpCircle,
            'intro': Presentation, 'summary': FileText, 'conclus': CheckCircle
        };

        return slides.map(slide => {
            const textToCheck = (slide.title + " " + (slide.bullets?.map(b => b.text).join(" ") || "")).toLowerCase();
            for (const [key, icon] of Object.entries(iconMap)) {
                if (textToCheck.includes(key)) return icon;
            }
            if (slide.type === 'title') return Presentation;
            if (slide.codeBlock) return Code;
            if (slide.comparison) return List;
            return Lightbulb;
        });
    }, [slides]);

    const activeIcon = slideIcons[currentSlide] || Lightbulb;





    // Dynamic Sizing Logic to prevent scrolling
    const layoutClasses = useMemo(() => {
        const { bullets = [], type, codeBlock, comparison, cards } = activeSlideData;
        let score = 0;

        // Calculate density score
        if (bullets.length) score += bullets.length * 1.5;
        bullets.forEach(b => score += (b.text.length / 60)); // Long bullets weight more
        if (codeBlock) score += 6;
        if (comparison) score += 8;
        if (cards) score += 6;

        // Map score to classes
        if (score > 18) return {
            title: 'text-2xl mb-4',
            bullet: 'text-sm leading-snug',
            container: 'p-6',
            gap: 'gap-2'
        }; // Extreme density
        if (score > 12) return {
            title: 'text-3xl mb-6',
            bullet: 'text-base leading-normal',
            container: 'p-8',
            gap: 'gap-3'
        }; // High density
        if (score > 6) return {
            title: 'text-4xl mb-8',
            bullet: 'text-lg leading-relaxed',
            container: 'p-10',
            gap: 'gap-4'
        }; // Medium
        return {
            title: 'text-5xl mb-8',
            bullet: 'text-xl leading-loose',
            container: 'p-12',
            gap: 'gap-6'
        };
    }, [activeSlideData]);


    return (
        <div className="flex flex-col h-full bg-slate-900 border border-white/10 rounded-xl overflow-hidden relative">

            {/* Slide Viewer */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

                {/* Dynamic Content Icon Background - Lightweight */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none overflow-hidden">
                    {React.createElement(activeIcon, { size: 200, className: "text-white" })}
                </div>



                {/* Navigation Arrows */}
                <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className="absolute left-4 z-40 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition-all text-white border border-white/10"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === slides.length - 1}
                    className="absolute right-4 z-40 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-30 disabled:hover:bg-slate-800/80 transition-all text-white border border-white/10"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Main Slide Card - "Contain" mode to ensure full visibility */}
                <div className="h-full w-auto max-w-6xl aspect-video max-h-full flex flex-col bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden relative mx-auto my-auto">

                    {/* Logo/Header */}
                    <div className="absolute top-6 right-6 flex items-center gap-2 opacity-30">
                        <Presentation className="h-5 w-5 text-purple-400" />
                        <span className="font-bold tracking-wider text-sm">SUMMARIZE.AI</span>
                    </div>

                    {/* Slide Content */}
                    <div className={`flex-1 flex flex-col ${layoutClasses.container} relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent`}>

                        {/* Title Slide */}
                        {activeSlideData.type === 'title' ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 relative">
                                <div className="p-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 shadow-[0_0_60px_-10px_rgba(147,51,234,0.3)]">
                                    {React.createElement(activeIcon, { size: 96, className: "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" })}
                                </div>
                                <div>
                                    <h1 className={`${layoutClasses.title} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 mb-6 drop-shadow-sm pb-2`}>
                                        {activeSlideData.title}
                                    </h1>
                                    <p className="text-xl text-slate-400 tracking-wide font-light">{activeSlideData.subtitle}</p>
                                </div>
                            </div>
                        ) : activeSlideData.layout === 'cards' && activeSlideData.cards ? (
                            // Cards Layout
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <IconComponent name={activeSlideData.icon} className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h2 className={`${layoutClasses.title} font-bold text-white`}>{activeSlideData.title}</h2>
                                </div>
                                <div className={`grid grid-cols-2 ${layoutClasses.gap} flex-1 overflow-y-auto`}>
                                    {activeSlideData.cards.map((card, idx) => (
                                        <div key={idx} className="bg-slate-800/40 border border-white/10 rounded-xl p-4 hover:bg-slate-800/60 transition-colors overflow-hidden">
                                            <h3 className="text-base font-bold text-cyan-400 mb-1 truncate">{card.title}</h3>
                                            <p className={`text-slate-300 ${layoutClasses.bullet} opacity-90 line-clamp-4`}>{renderBold(card.text)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Standard/Icon/Comparison Layouts
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5 shrink-0">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <IconComponent name={activeSlideData.icon} className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <h2 className={`${layoutClasses.title} font-bold text-white mb-0`}>{activeSlideData.title}</h2>
                                </div>

                                <div className="flex-1 flex gap-8 items-start overflow-y-auto">
                                    {/* Left Content */}
                                    <div className="flex-1 h-full overflow-hidden">
                                        {/* Comparison logic if layout is comparison */}
                                        {activeSlideData.layout === 'comparison' && activeSlideData.comparison ? (
                                            <div className="w-full grid grid-cols-2 gap-4 h-full">
                                                <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4 overflow-hidden">
                                                    <h3 className="text-lg font-bold text-red-400 mb-2 border-b border-red-500/20 pb-2 truncate">{activeSlideData.comparison.leftTitle}</h3>
                                                    <ul className={`space-y-2 ${layoutClasses.bullet}`}>
                                                        {activeSlideData.comparison.leftPoints.map((p, i) => (
                                                            <li key={i} className="flex gap-2 text-slate-300">
                                                                <span className="text-red-500">•</span>
                                                                <span className="flex-1 line-clamp-2">{renderBold(p)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4 overflow-hidden">
                                                    <h3 className="text-lg font-bold text-green-400 mb-2 border-b border-green-500/20 pb-2 truncate">{activeSlideData.comparison.rightTitle}</h3>
                                                    <ul className={`space-y-2 ${layoutClasses.bullet}`}>
                                                        {activeSlideData.comparison.rightPoints.map((p, i) => (
                                                            <li key={i} className="flex gap-2 text-slate-300">
                                                                <span className="text-green-500">•</span>
                                                                <span className="flex-1 line-clamp-2">{renderBold(p)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            // Standard Bullets
                                            <div className={`flex flex-col ${layoutClasses.gap}`}>
                                                {activeSlideData.bullets.map((bullet, idx) => (
                                                    <div key={idx} className="flex gap-3 items-start group">
                                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 group-hover:bg-purple-500 transition-colors" />
                                                        <div className={`flex-1 ${layoutClasses.bullet} text-slate-200 font-light`}>
                                                            {bullet.highlight && <strong className="text-cyan-400 font-bold block mb-0.5">{bullet.highlight}</strong>}
                                                            {renderBold(bullet.text)}
                                                        </div>
                                                    </div>
                                                ))}
                                                {activeSlideData.codeBlock && (
                                                    <div className="mt-2 p-3 bg-black/40 rounded-lg border border-white/10 font-mono text-xs text-green-400 overflow-x-auto max-h-40 custom-scrollbar">
                                                        <pre>{activeSlideData.codeBlock}</pre>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side: Icon */}
                                    <div className="w-1/3 flex items-center justify-center h-full">
                                        <div className="p-12 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/5 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {React.createElement(activeIcon, { size: 160, className: "text-slate-600 group-hover:text-slate-400 transition-colors duration-500" })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Progress Bar */}
                    <div className="h-1.5 bg-slate-800 w-full mt-auto relative">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out"
                            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Slide Strip - Compact */}
            <div className="h-16 bg-black/40 border-t border-white/10 flex items-center gap-2 px-4 overflow-x-auto custom-scrollbar shrink-0">
                {slides.map((slide, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`flex-shrink-0 w-20 h-12 rounded-lg border transition-all relative overflow-hidden group ${currentSlide === idx ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-white/10 hover:border-white/30'}`}
                    >
                        {/* Thumbnail: Attempt to show tiny image if available */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                            {slide.type === 'title' ? (
                                <IconComponent name={slide.icon} className="h-6 w-6 text-slate-500" />
                            ) : (
                                <div className="space-y-1 w-full px-2">
                                    <div className="h-1 w-2/3 bg-slate-600 rounded-sm" />
                                    <div className="h-1 w-full bg-slate-700 rounded-sm" />
                                    <div className="h-1 w-1/2 bg-slate-700 rounded-sm" />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
