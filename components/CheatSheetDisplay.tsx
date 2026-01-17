"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import {
    Download, X, Share2, Copy, Check,
    Presentation, Brain, Lightbulb, Target, FileText, Maximize2, Minimize2
} from "lucide-react";
import { createShareLink, getSharedSummary } from "@/lib/db";
import { MindMapSection } from "@/components/visualizations/MindMapSection";
import { SlidesSection } from "@/components/visualizations/SlidesSection";
import { FlashcardsSection } from "@/components/visualizations/FlashcardsSection";
import { QuizSection } from "@/components/visualizations/QuizSection";

interface CheatSheetDisplayProps {
    summary: string;
    format?: string;
    videoTitle?: string;
    onClose?: () => void;
    summaryId?: string;
    userId?: string;
}

const getIconForTopic = (title: string, content?: string): string => {
    const text = (title + ' ' + (content || '')).toLowerCase();
    if (/network|lan|wan|internet|tcp|ip|router|ethernet|packet/.test(text)) return 'network';
    if (/osi|layer|protocol|http|ftp|dns/.test(text)) return 'layers';
    if (/wireless|wifi|bluetooth|radio|frequency/.test(text)) return 'wifi';
    if (/signal|wave|modulation|amplitude|carrier/.test(text)) return 'signal';
    if (/mail|email|smtp|letter|send|message/.test(text)) return 'mail';
    return 'zap';
};

export function CheatSheetDisplay({ summary, format = 'pdf', videoTitle = "Study Guide", onClose, summaryId, userId }: CheatSheetDisplayProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'slides' | 'mindmap' | 'quiz' | 'flashcards'>(() => {
        if (format === 'slides') return 'slides';
        if (format === 'mindmap') return 'mindmap';
        if (format === 'flashcards') return 'flashcards';
        if (format === 'quiz') return 'quiz';
        return 'summary';
    });

    // Share state
    const [sharing, setSharing] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [focusMode, setFocusMode] = useState(true);

    // Clean title - remove "Your Video" / "Your Content" fallback issues AND file extensions
    const displayTitle = useMemo(() => {
        let title = videoTitle || 'Study Guide';
        if (title === 'Your Content' || title === 'Your Video') title = 'Study Guide';
        // Remove common file extensions
        return title.replace(/\.(pdf|mp4|mp3|docx|wav|m4a|txt)$/i, '');
    }, [videoTitle]);

    // Initialize Share Link if exists
    useEffect(() => {
        if (summaryId) {
            getSharedSummary(summaryId).then(data => {
                if (data && data.shareToken) {
                    setShareUrl(`${window.location.origin}/share/${data.shareToken}`);
                }
            });
        }
    }, [summaryId]);

    const handleShare = async () => {
        if (!summaryId || !userId) return;
        setSharing(true);
        try {
            const token = await createShareLink(summaryId, userId);
            if (token) {
                setShareUrl(`${window.location.origin}/share/${token}`);
            }
        } catch (error) {
            console.error("Error creating share link:", error);
        } finally {
            setSharing(false);
        }
    };

    const copyToClipboard = () => {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Download handlers
    const safeFileName = displayTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50) || 'Study_Guide';

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yPos = margin;
            let isNewPage = true;

            // Helper to draw dark background
            const drawPageBackground = () => {
                doc.setFillColor(15, 23, 42); // slate-900
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
            };

            // Helper to check page break
            const checkPageBreak = (neededHeight: number) => {
                if (yPos + neededHeight > pageHeight - margin) {
                    doc.addPage();
                    drawPageBackground(); // Always draw background on new page
                    yPos = margin;
                    isNewPage = true;
                }
            };

            // Draw background for first page
            drawPageBackground();

            // Title - Gradient effect simulated with blue color
            doc.setTextColor(34, 211, 238); // cyan-400
            doc.setFontSize(32);
            doc.setFont("helvetica", "bold");
            const titleLines = doc.splitTextToSize(displayTitle, contentWidth);
            doc.text(titleLines, margin, yPos + 10);
            yPos += (titleLines.length * 14) + 10;

            // Subtitle
            doc.setFontSize(12);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.setFont("helvetica", "normal");
            doc.text("Comprehensive Study Guide generated by AI", margin, yPos);
            yPos += 12;

            // Decorative line
            doc.setDrawColor(59, 130, 246); // blue-500
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 12;

            // Parse and render markdown content
            const lines = summary.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) {
                    yPos += 3;
                    continue;
                }

                // Heading 2 (## Title) - Large blue heading
                if (trimmed.startsWith('## ')) {
                    const text = trimmed.replace('## ', '').replace(/[📚🎯📝❓📌⭐⚠️✅📊📈🧠⚡]/g, '').trim();
                    checkPageBreak(18);
                    yPos += 10;
                    doc.setFontSize(18);
                    doc.setTextColor(96, 165, 250); // blue-400
                    doc.setFont("helvetica", "bold");
                    doc.text(text, margin, yPos);
                    yPos += 10;
                }
                // Heading 3 (### Subtitle) - Purple heading
                else if (trimmed.startsWith('### ')) {
                    const text = trimmed.replace('### ', '');
                    checkPageBreak(14);
                    yPos += 6;
                    doc.setFontSize(14);
                    doc.setTextColor(192, 132, 252); // purple-400
                    doc.setFont("helvetica", "bold");
                    doc.text(text, margin, yPos);
                    yPos += 8;
                }
                // Bullet points with bold text handling
                else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    let text = trimmed.replace(/^[-*]\s+/, '');

                    // Check for bold prefix (e.g., **Topics appearing:**)
                    const boldMatch = text.match(/^\*\*(.+?)\*\*:?\s*(.*)/);

                    checkPageBreak(10);

                    if (boldMatch) {
                        // Render bold part in cyan
                        doc.setFontSize(11);
                        doc.setTextColor(34, 211, 238); // cyan-400
                        doc.setFont("helvetica", "bold");
                        const boldText = `• ${boldMatch[1]}:`;
                        doc.text(boldText, margin + 5, yPos);

                        // Render rest in normal color
                        if (boldMatch[2]) {
                            const boldWidth = doc.getTextWidth(boldText);
                            doc.setTextColor(226, 232, 240); // slate-200
                            doc.setFont("helvetica", "normal");
                            const restLines = doc.splitTextToSize(boldMatch[2], contentWidth - boldWidth - 10);
                            doc.text(restLines[0], margin + 5 + boldWidth + 2, yPos);
                            yPos += 6;
                            // If text wrapped, continue on next lines
                            for (let i = 1; i < restLines.length; i++) {
                                checkPageBreak(6);
                                doc.text(restLines[i], margin + 10, yPos);
                                yPos += 6;
                            }
                        } else {
                            yPos += 6;
                        }
                    } else {
                        // Regular bullet
                        text = text.replace(/\*\*/g, '');
                        doc.setFontSize(11);
                        doc.setTextColor(226, 232, 240); // slate-200
                        doc.setFont("helvetica", "normal");
                        const bulletLines = doc.splitTextToSize(`• ${text}`, contentWidth - 10);
                        checkPageBreak(bulletLines.length * 6);
                        doc.text(bulletLines, margin + 5, yPos);
                        yPos += bulletLines.length * 6;
                    }
                }
                // Numbered lists
                else if (/^\d+\.\s/.test(trimmed)) {
                    doc.setFontSize(11);
                    doc.setTextColor(226, 232, 240);
                    doc.setFont("helvetica", "normal");
                    const numLines = doc.splitTextToSize(trimmed.replace(/\*\*/g, ''), contentWidth - 10);
                    checkPageBreak(numLines.length * 6);
                    doc.text(numLines, margin + 5, yPos);
                    yPos += numLines.length * 6;
                }
                // Blockquote
                else if (trimmed.startsWith('> ')) {
                    const text = trimmed.replace('> ', '');
                    doc.setFontSize(11);
                    doc.setTextColor(167, 139, 250); // purple-400
                    doc.setFont("helvetica", "italic");
                    const quoteLines = doc.splitTextToSize(text, contentWidth - 15);
                    checkPageBreak(quoteLines.length * 6);
                    doc.text(quoteLines, margin + 10, yPos);
                    yPos += quoteLines.length * 6;
                }
                // Normal text (skip tables and code blocks)
                else if (!trimmed.startsWith('|') && !trimmed.startsWith('```') && !trimmed.startsWith('#')) {
                    doc.setFontSize(11);
                    doc.setTextColor(203, 213, 225); // slate-300
                    doc.setFont("helvetica", "normal");
                    const textLines = doc.splitTextToSize(trimmed.replace(/\*\*/g, ''), contentWidth);
                    checkPageBreak(textLines.length * 6);
                    doc.text(textLines, margin, yPos);
                    yPos += textLines.length * 6;
                }
            }

            doc.save(`${safeFileName}.pdf`);
        } catch (e) {
            console.error("PDF Download failed", e);
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadDOCX = async () => {
        setDownloading(true);
        try {
            const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
            const { saveAs } = await import('file-saver');

            // Parse summary into paragraphs
            const paragraphs: any[] = [];

            // Add title
            paragraphs.push(new Paragraph({
                text: displayTitle,
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 }
            }));

            // Parse markdown-like content (Preserved logic)
            const lines = summary.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.startsWith('## ')) {
                    paragraphs.push(new Paragraph({
                        text: trimmed.replace('## ', '').replace(/[📚🎯📝❓📌⭐⚠️✅📊📈🧠⚡]/g, '').trim(),
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 400, after: 200 }
                    }));
                } else if (trimmed.startsWith('### ')) {
                    paragraphs.push(new Paragraph({
                        text: trimmed.replace('### ', ''),
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 300, after: 100 }
                    }));
                } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    paragraphs.push(new Paragraph({
                        children: [new TextRun({ text: '• ' + trimmed.replace(/^[-*]\s+/, '') })],
                        spacing: { after: 100 }
                    }));
                } else if (/^\d+\.\s/.test(trimmed)) {
                    paragraphs.push(new Paragraph({
                        children: [new TextRun({ text: trimmed })],
                        spacing: { after: 100 }
                    }));
                } else if (trimmed.startsWith('> ')) {
                    paragraphs.push(new Paragraph({
                        children: [new TextRun({ text: trimmed.replace('> ', ''), italics: true })],
                        indent: { left: 720 },
                        spacing: { before: 100, after: 100 }
                    }));
                } else if (!trimmed.startsWith('|') && !trimmed.startsWith('```')) {
                    // Handle bold text simple parsing
                    const parts = trimmed.split(/\*\*(.+?)\*\*/g);
                    const children = parts.map((part, i) =>
                        new TextRun({ text: part, bold: i % 2 === 1 })
                    );
                    paragraphs.push(new Paragraph({ children, spacing: { after: 100 } }));
                }
            }

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: paragraphs
                }]
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${safeFileName}.docx`);
        } catch (e) {
            console.error("DOCX export error:", e);
        } finally {
            setDownloading(false);
        }
    };

    const parseSlides = (summaryText: string) => {
        const MAX_SLIDES = 45;
        // 1. Try parsing strictly as JSON first
        try {
            const jsonMatch = summaryText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((s: any) => ({
                        title: s.title || "Slide",
                        subtitle: s.subtitle,
                        bullets: Array.isArray(s.bullets) ? s.bullets.map((b: string | any) => typeof b === 'string' ? { text: b } : b) : [],
                        speakerNotes: s.speakerNotes,
                        type: s.type || 'content',
                        layout: s.layout || 'plain',
                        // icon: s.icon || getIconForTopic(s.title || ""),
                        comparison: s.comparison
                    }));
                }
            }
        } catch (e) {
            console.log("Not JSON slides, using markdown parser");
        }

        // 2. Legacy Markdown Parsing
        const result: any[] = [];
        result.push({ title: displayTitle, subtitle: 'AI-Generated Study Guide', bullets: [], type: 'title', layout: 'plain', icon: 'book' });

        const sections = summaryText.split(/(?=^## )/m).filter((s: string) => s.trim());

        sections.forEach((section: string) => {
            if (result.length >= MAX_SLIDES) return;

            const titleMatch = section.match(/^## (.+)/m);
            const rawTitle = titleMatch ? titleMatch[1].replace(/[📚🎯📝❓📌⭐⚠️✅📊📈🧠⚡]/g, '').trim() : 'Topic';
            const allBullets: { text: string; highlight?: string }[] = [];

            // Extract bullets
            const lines = section.split('\n');
            let capture = false;
            for (const line of lines) {
                if (line.match(/^## /)) { capture = true; continue; }
                if (!capture) continue;
                if (line.match(/^# /)) break; // Stop at next H1

                const bulletMatch = line.match(/^[-*]\s+(.+)/);
                if (bulletMatch) {
                    const cleanText = bulletMatch[1].replace(/\*\*/g, '').trim();
                    if (cleanText) allBullets.push({ text: cleanText });
                }
            }

            // Chunk bullets
            if (allBullets.length > 7) {
                for (let i = 0; i < allBullets.length; i += 5) {
                    const chunk = allBullets.slice(i, i + 5);
                    result.push({ title: i === 0 ? rawTitle : `${rawTitle} (cont.)`, bullets: chunk, type: 'content' });
                }
            } else {
                if (allBullets.length > 0) result.push({ title: rawTitle, bullets: allBullets, type: 'content' });
            }
        });
        return result;
    };


    const handleDownloadSlidesPPTX = async () => {
        setDownloading(true);
        try {
            const pptxgen = (await import('pptxgenjs')).default;
            const pres = new pptxgen();

            // Set properties
            pres.title = displayTitle;
            pres.layout = 'LAYOUT_16x9';

            const slides = parseSlides(summary);

            slides.forEach((slide: any) => {
                const s = pres.addSlide();

                // Background
                s.background = { color: '0f172a' }; // Dark slate theme

                // Title
                s.addText(slide.title, {
                    x: 0.5, y: 0.5, w: '90%', h: 1,
                    fontSize: 32,
                    color: 'ffffff',
                    bold: true,
                    align: 'left'
                });

                if (slide.subtitle) {
                    s.addText(slide.subtitle, {
                        x: 0.5, y: 1.5, w: '90%', h: 1,
                        fontSize: 24,
                        color: '94a3b8', // slate-400
                        align: 'left'
                    });
                }

                // Content
                if (slide.comparison) {
                    // Comparison Slide
                    s.addText(slide.comparison.leftTitle, { x: 0.5, y: 2, w: '45%', h: 0.5, fontSize: 18, color: 'bfdbfe', bold: true });
                    s.addText(slide.comparison.rightTitle, { x: 5.5, y: 2, w: '45%', h: 0.5, fontSize: 18, color: 'bbf7d0', bold: true });

                    slide.comparison.leftPoints.forEach((p: string, i: number) => {
                        s.addText(`• ${p}`, { x: 0.5, y: 2.7 + (i * 0.4), w: '45%', h: 0.4, fontSize: 14, color: 'e2e8f0' });
                    });
                    slide.comparison.rightPoints.forEach((p: string, i: number) => {
                        s.addText(`• ${p}`, { x: 5.5, y: 2.7 + (i * 0.4), w: '45%', h: 0.4, fontSize: 14, color: 'e2e8f0' });
                    });

                } else if (slide.bullets && slide.bullets.length > 0) {
                    slide.bullets.forEach((b: any, i: number) => {
                        s.addText(b.text, {
                            x: 1, y: 2 + (i * 0.5), w: '85%', h: 0.5,
                            fontSize: 18,
                            color: 'e2e8f0',
                            bullet: { code: '2022' }
                        });
                    });
                }

                // Footer
                s.addText("Generated by Summarize.ai", { x: 0.5, y: 6.8, w: '90%', h: 0.4, fontSize: 10, color: '64748b', align: 'center' });
            });

            await pres.writeFile({ fileName: `${safeFileName}.pptx` });

        } catch (e) {
            console.error("PPTX gen error", e);
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadSlidesPDF = async () => {
        setDownloading(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();

            const slides = parseSlides(summary);

            slides.forEach((slide: any, i: number) => {
                if (i > 0) doc.addPage();

                // Background
                doc.setFillColor(15, 23, 42); // slate-900
                doc.rect(0, 0, width, height, 'F');

                // Title
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(24);
                doc.setFont("helvetica", "bold");
                doc.text(slide.title, 20, 20);

                // Subtitle
                if (slide.subtitle) {
                    doc.setFontSize(16);
                    doc.setTextColor(148, 163, 184); // slate-400
                    doc.setFont("helvetica", "normal");
                    doc.text(slide.subtitle, 20, 30);
                }

                // Separator line
                doc.setDrawColor(51, 65, 85); // slate-700
                doc.line(20, 35, width - 20, 35);

                let yPos = 50;

                // Content
                doc.setFontSize(14);
                doc.setTextColor(226, 232, 240); // slate-200

                if (slide.comparison) {
                    const colWidth = (width - 60) / 2;
                    doc.text(slide.comparison.leftTitle, 20, yPos);
                    doc.text(slide.comparison.rightTitle, 20 + colWidth + 20, yPos);

                    yPos += 10;

                    const leftPoints = slide.comparison.leftPoints || [];
                    const rightPoints = slide.comparison.rightPoints || [];
                    const maxCount = Math.max(leftPoints.length, rightPoints.length);

                    for (let k = 0; k < maxCount; k++) {
                        if (leftPoints[k]) {
                            const splitTitle = doc.splitTextToSize(`• ${leftPoints[k]}`, colWidth);
                            doc.text(splitTitle, 20, yPos);
                        }
                        if (rightPoints[k]) {
                            const splitTitle = doc.splitTextToSize(`• ${rightPoints[k]}`, colWidth);
                            doc.text(splitTitle, 20 + colWidth + 20, yPos);
                        }
                        yPos += 10; // Approx logic, splitTextToSize check better in real app but sufficient for now
                    }

                } else if (slide.bullets) {
                    slide.bullets.forEach((b: any) => {
                        const bulletText = `• ${b.text}`;
                        const splitText = doc.splitTextToSize(bulletText, width - 40);
                        doc.text(splitText, 20, yPos);
                        yPos += (splitText.length * 7); // Spacing based on lines
                    });
                }
            });

            doc.save(`${safeFileName}_slides.pdf`);
        } catch (e) {
            console.error("PDF gen error", e);
        } finally {
            setDownloading(false);
        }
    };

    // Define standard tabs
    const allTabs = [
        { id: 'summary', icon: FileText, label: 'Summary' },
        { id: 'slides', icon: Presentation, label: 'Slides' },
        { id: 'mindmap', icon: Brain, label: 'Mind Map' },
        { id: 'flashcards', icon: Lightbulb, label: 'Flashcards' },
        { id: 'quiz', icon: Target, label: 'Quiz' }
    ];

    // Filter tabs based on explicit format prop
    // This allows fallback to Markdown parsing (e.g. for Slides) without being hidden by strict JSON detection
    const visibleTabs = useMemo(() => {
        if (format === 'slides') return allTabs.filter(t => t.id === 'slides');
        if (format === 'mindmap') return allTabs.filter(t => t.id === 'mindmap');
        if (format === 'flashcards') return allTabs.filter(t => t.id === 'flashcards');
        if (format === 'quiz') return allTabs.filter(t => t.id === 'quiz');

        // Default (PDF/Summary) -> Show Summary
        return allTabs.filter(t => t.id === 'summary');
    }, [format]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${focusMode ? 'p-0' : 'p-4'} bg-black/80 backdrop-blur-md animate-fadeIn`}>
            <div className={`bg-slate-900 w-full ${focusMode ? 'max-w-full h-full rounded-none' : 'max-w-6xl h-[90vh] rounded-3xl'} border border-white/10 shadow-2xl flex flex-col overflow-hidden relative`}>

                {/* Focus Mode Floating Controls */}
                {focusMode && (
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                        {activeTab === 'slides' && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadSlidesPDF}
                                    disabled={downloading}
                                    className="gap-2 bg-slate-800/80 border-white/10 hover:bg-slate-700 text-white backdrop-blur-sm"
                                >
                                    <Download className="h-4 w-4" /> PDF
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadSlidesPPTX}
                                    disabled={downloading}
                                    className="gap-2 bg-slate-800/80 border-white/10 hover:bg-slate-700 text-white backdrop-blur-sm"
                                >
                                    <Download className="h-4 w-4" /> PPTX
                                </Button>
                            </>
                        )}
                        {activeTab === 'summary' && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadPDF}
                                    disabled={downloading}
                                    className="gap-2 bg-slate-800/80 border-white/10 hover:bg-slate-700 text-white backdrop-blur-sm"
                                >
                                    <Download className="h-4 w-4" /> PDF
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadDOCX}
                                    disabled={downloading}
                                    className="gap-2 bg-slate-800/80 border-white/10 hover:bg-slate-700 text-white backdrop-blur-sm"
                                >
                                    <Download className="h-4 w-4" /> DOCX
                                </Button>
                            </>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full bg-slate-800/80 hover:bg-red-500/20 hover:text-red-500 text-white backdrop-blur-sm"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {/* Header - Hidden in focus mode */}
                {!focusMode && (
                    <>
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                                    {activeTab === 'summary' && <FileText className="h-6 w-6 text-white" />}
                                    {activeTab === 'slides' && <Presentation className="h-6 w-6 text-white" />}
                                    {activeTab === 'mindmap' && <Brain className="h-6 w-6 text-white" />}
                                    {activeTab === 'flashcards' && <Lightbulb className="h-6 w-6 text-white" />}
                                    {activeTab === 'quiz' && <Target className="h-6 w-6 text-white" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">{displayTitle}</h2>
                                    <p className="text-sm text-slate-400 font-medium">AI Generated Study Content</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Sharing */}
                                {summaryId && userId && (
                                    <div className="flex items-center gap-2 mr-4">
                                        {shareUrl ? (
                                            <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 border border-white/10">
                                                <span className="text-xs text-slate-400 max-w-[100px] truncate">{shareUrl}</span>
                                                <button onClick={copyToClipboard} className="text-blue-400 hover:text-blue-300">
                                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleShare}
                                                disabled={sharing}
                                                className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                            >
                                                <Share2 className="h-4 w-4" />
                                                Share
                                            </Button>
                                        )}
                                    </div>
                                )}

                                <div className="h-8 w-px bg-white/10 mx-2" />

                                {activeTab === 'summary' && (
                                    <>
                                        <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={downloading} className="gap-2 bg-slate-800 border-white/10 hover:bg-slate-700 text-white">
                                            <Download className="h-4 w-4" /> PDF
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDownloadDOCX} disabled={downloading} className="gap-2 bg-slate-800 border-white/10 hover:bg-slate-700 text-white">
                                            <Download className="h-4 w-4" /> DOCX
                                        </Button>
                                    </>
                                )}
                                {activeTab === 'slides' && (
                                    <>
                                        <Button variant="outline" size="sm" onClick={handleDownloadSlidesPDF} disabled={downloading} className="gap-2 bg-slate-800 border-white/10 hover:bg-slate-700 text-white">
                                            <Download className="h-4 w-4" /> PDF
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDownloadSlidesPPTX} disabled={downloading} className="gap-2 bg-slate-800 border-white/10 hover:bg-slate-700 text-white">
                                            <Download className="h-4 w-4" /> PPTX
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setFocusMode(true)}
                                    className="rounded-full bg-slate-800 border-white/10 hover:bg-slate-700 text-white"
                                    title="Focus Mode (hide header)"
                                >
                                    <Maximize2 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors">
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Tabs - Only show if we have multiple views (or just center the title/icon if single) */}
                        <div className="flex items-center justify-center p-4 gap-4 border-b border-white/10 bg-slate-900/30">
                            {visibleTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${activeTab === tab.id
                                        ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                                        : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                                        } cursor-default`} // Made cursor default since mostly single tab now
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-950/50 relative">
                    {/* Summary View */}
                    {activeTab === 'summary' && (
                        <div ref={contentRef} className="max-w-4xl mx-auto bg-slate-900 p-12 rounded-2xl shadow-2xl border border-white/5 min-h-full prose prose-invert prose-lg">
                            <div className="mb-8 pb-8 border-b border-white/10">
                                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">{displayTitle}</h1>
                                <p className="text-slate-400 text-xl font-light">Comprehensive Study Guide generated by AI</p>
                            </div>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-l-4 border-blue-500 pl-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-blue-200 mt-8 mb-4 flex items-center gap-2" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-4 text-slate-300" {...props} />,
                                li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-cyan-400" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-500 bg-purple-900/20 p-4 rounded-r-lg my-6 italic text-slate-300" {...props} />,
                                code: ({ node, className, children, ...props }: any) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return match ? (
                                        <div className="relative group">
                                            <div className="absolute top-0 right-0 bg-slate-700 text-xs px-2 py-1 rounded-bl-lg text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">{match[1]}</div>
                                            <code className={`block bg-black/50 p-4 rounded-lg text-sm font-mono border border-white/10 overflow-x-auto ${className}`} {...props}>
                                                {children}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className="bg-slate-800 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                table: ({ node, ...props }) => <div className="overflow-x-auto my-6 rounded-lg border border-white/10"><table className="w-full text-left border-collapse" {...props} /></div>,
                                th: ({ node, ...props }) => <th className="bg-slate-800 p-3 font-bold text-white border-b border-white/10" {...props} />,
                                td: ({ node, ...props }) => <td className="p-3 border-b border-slate-800 text-slate-300" {...props} />,
                            }}>
                                {/* If summary starts with [, it's likely structured JSON for slides/cards. Don't show raw JSON. */}
                                {summary.trim().startsWith('[') ?
                                    `> **Note:** This content is structured data for **Slides, Flashcards, or Mind Maps**.\n\nPlease select the **Slides**, **Mind Map**, or **Flashcards** tab above to view the content.`
                                    : summary}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Slides View */}
                    {activeTab === 'slides' && <SlidesSection key={`slides-${summary.length}-${summary.slice(0, 20)}`} summary={summary} displayTitle={displayTitle} />}

                    {/* Mind Map View */}
                    {activeTab === 'mindmap' && <MindMapSection summary={summary} displayTitle={displayTitle} />}

                    {/* Flashcards View */}
                    {activeTab === 'flashcards' && <FlashcardsSection summary={summary} />}

                    {/* Quiz View */}
                    {activeTab === 'quiz' && <QuizSection summary={summary} />}
                </div>
            </div>
        </div >
    );
}
