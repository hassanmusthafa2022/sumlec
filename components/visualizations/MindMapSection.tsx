"use client";

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';

interface MindMapNode {
    id: string;
    text: string;
    parentId: string | null;
    children: string[];
    color: string;
    depth: number;
}

// Expanded version with actual child nodes
type ExpandedMindMapNode = Omit<MindMapNode, 'children'> & { children: ExpandedMindMapNode[] };

interface MindMapSectionProps {
    summary: string;
    displayTitle: string;
}

// --- Mind Map Helpers ---

// Simple node component
const MindMapNodeItem = ({ node, expandedNodes, toggleNode }: {
    node: ExpandedMindMapNode;
    expandedNodes: Set<string>;
    toggleNode: (id: string) => void;
}) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
        <div
            id={`node-${node.id}`}
            data-node={node.id}
            onClick={() => hasChildren && toggleNode(node.id)}
            className={`
                px-4 py-2 rounded-xl border-2 bg-slate-800 text-white 
                cursor-pointer transition-all duration-200 hover:scale-[1.02] 
                flex items-center gap-2 shrink-0 shadow-lg my-2
            `}
            style={{
                borderColor: node.color || '#6366f1',
                boxShadow: `0 4px 12px ${node.color || '#6366f1'}30`
            }}
        >
            <span className="text-sm font-medium whitespace-nowrap">{node.text}</span>
            {hasChildren && (
                <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all duration-200 shrink-0
                    ${isExpanded ? 'bg-slate-600 text-slate-300' : 'bg-blue-500 text-white hover:bg-blue-400'}
                `}>
                    {isExpanded ? '−' : '+'}
                </span>
            )}
        </div>
    );
};

// Recursive branch component with direction support
const MindMapBranch = ({ node, expandedNodes, toggleNode, getVisibleChildren, parentId, direction = 'right' }: {
    node: ExpandedMindMapNode;
    expandedNodes: Set<string>;
    toggleNode: (id: string) => void;
    getVisibleChildren: (id: string) => ExpandedMindMapNode[];
    parentId: string;
    direction?: 'left' | 'right';
}) => {
    const children = getVisibleChildren(node.id);
    const isExpanded = expandedNodes.has(node.id);

    return (
        <div className={`flex items-center ${direction === 'left' ? 'flex-row-reverse' : 'flex-row'}`} data-parent={parentId}>
            <MindMapNodeItem node={node} expandedNodes={expandedNodes} toggleNode={toggleNode} />
            {isExpanded && children.length > 0 && (
                <div className={`flex flex-col gap-2 ${direction === 'left' ? 'mr-12' : 'ml-12'} ${direction === 'left' ? 'items-end' : 'items-start'}`}>
                    {children.map((child) => (
                        <MindMapBranch
                            key={child.id}
                            node={child}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            getVisibleChildren={getVisibleChildren}
                            parentId={node.id}
                            direction={direction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Root wrapper with SVG overlay - Right Side Only
const MindMapTree = ({ root, rightTopics, expandedNodes, toggleNode, getVisibleChildren }: {
    root: ExpandedMindMapNode | null;
    rightTopics: ExpandedMindMapNode[];
    expandedNodes: Set<string>;
    toggleNode: (id: string) => void;
    getVisibleChildren: (id: string) => ExpandedMindMapNode[];
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [paths, setPaths] = useState<{ d: string; color: string }[]>([]);

    // Helper to get position relative to container
    const getPos = useCallback((el: HTMLElement) => {
        let x = 0;
        let y = 0;
        let curr = el;
        // Traverse up until we hit the container or null
        while (curr && curr !== containerRef.current) {
            x += curr.offsetLeft;
            y += curr.offsetTop;
            curr = curr.offsetParent as HTMLElement;
        }
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    }, []);

    // Draw Bezier curves logic (Internal Coordinates)
    const drawLines = useCallback(() => {
        if (!containerRef.current) return;

        const newPaths: { d: string; color: string }[] = [];
        const nodes = containerRef.current.querySelectorAll('[data-node]');

        nodes.forEach((nodeEl) => {
            const nodeId = (nodeEl as HTMLElement).dataset.node;
            if (!nodeId || nodeId === 'root') return;

            const parentId = (nodeEl.closest('[data-parent]') as HTMLElement)?.dataset.parent;
            if (!parentId) return;

            const parentEl = containerRef.current?.querySelector(`[data-node="${parentId}"]`);
            if (!parentEl) return;

            const childPos = getPos(nodeEl as HTMLElement);
            const parentPos = getPos(parentEl as HTMLElement);

            // Right Only Logic (Root -> Right)
            // Start: Parent Right Edge
            const x1 = parentPos.x + parentPos.w;
            const y1 = parentPos.y + parentPos.h / 2;

            // End: Child Left Edge
            const x2 = childPos.x;
            const y2 = childPos.y + childPos.h / 2;

            const cpX = (x1 + x2) / 2;
            const d = `M${x1},${y1} C${cpX},${y1} ${cpX},${y2} ${x2},${y2}`;

            newPaths.push({ d, color: '#ec4899' }); // Using Pink-500 equivalent
        });

        setPaths(newPaths);
    }, [expandedNodes, rightTopics, root, getPos]);

    // Redraw on changes
    useEffect(() => {
        const timer = setTimeout(drawLines, 50);
        return () => clearTimeout(timer);
    }, [drawLines]);

    // Redraw on resize
    useEffect(() => {
        const observer = new ResizeObserver(drawLines);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [drawLines]);

    return (
        <div className="relative p-16 min-w-max" ref={containerRef}>
            {/* SVG Layer */}
            <svg
                className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
                style={{ zIndex: 100 }}
            >
                {paths.map((path, i) => (
                    <path
                        key={i}
                        d={path.d}
                        fill="none"
                        stroke={path.color}
                        strokeWidth="3"
                        strokeOpacity="0.6"
                    />
                ))}
            </svg>

            {/* Content: Root | Right Topics */}
            <div className="flex items-center gap-12 relative z-10">

                {/* Root Node */}
                <div
                    data-node="root"
                    className="px-6 py-3 rounded-full bg-white text-slate-900 font-bold text-lg border-4 border-purple-500 shadow-2xl shrink-0 mx-4"
                >
                    {root?.text || "Topic"}
                </div>

                {/* Right Topics */}
                <div className="flex flex-col gap-4 items-start">
                    {rightTopics.map((topic) => (
                        <MindMapBranch
                            key={topic.id}
                            node={topic}
                            expandedNodes={expandedNodes}
                            toggleNode={toggleNode}
                            getVisibleChildren={getVisibleChildren}
                            parentId="root"
                            direction="right"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export function MindMapSection({ summary, displayTitle }: MindMapSectionProps) {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

    // Mind Map interactive state
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const mindMapRef = useRef<HTMLDivElement>(null);

    const branchColors = ['#f472b6', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

    // Mind Map Nodes matching new Layout
    const nodeLayout = useMemo(() => {
        const nodes: MindMapNode[] = [];
        let root: MindMapNode = { id: 'root', text: displayTitle, parentId: null, children: [], color: '#ffffff', depth: 0 };
        const leftTopics: MindMapNode[] = [];
        const rightTopics: MindMapNode[] = [];

        // 1. Try JSON Parsing (New Format)
        try {
            // Regex to capture JSON even if wrapped in markdown blocks
            const jsonMatch = summary.match(/\{[\s\S]*\}/);
            // We look for a structure that has "root" and "children"
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.root && Array.isArray(parsed.children)) {
                    root.text = parsed.root;
                    nodes.push(root);

                    // Recursive function to flatten the tree for rendering
                    const processNode = (n: any, parentId: string, depth: number, index: number) => {
                        const nodeId = n.id || `node-${depth}-${index}-${Math.random().toString(36).substr(2, 9)}`;
                        const color = depth === 1 ? branchColors[index % branchColors.length] : '#ffffff';

                        const newNode: MindMapNode = {
                            id: nodeId,
                            text: n.text,
                            parentId: parentId,
                            children: [],
                            color: color,
                            depth: depth
                        };
                        nodes.push(newNode);

                        // Link parent
                        const parentNode = nodes.find(x => x.id === parentId);
                        if (parentNode) {
                            parentNode.children.push(nodeId);
                            if (depth > 1) newNode.color = parentNode.color; // Inherit color from branch
                        }

                        // Distribute top-level nodes - ALL TO RIGHT
                        if (depth === 1) {
                            rightTopics.push(newNode);
                        }

                        if (n.children && Array.isArray(n.children)) {
                            n.children.forEach((child: any, i: number) => processNode(child, nodeId, depth + 1, i));
                        }
                    };

                    parsed.children.forEach((child: any, i: number) => processNode(child, 'root', 1, i));
                    return { nodes, rootNode: root, leftTopics: [], rightTopics };
                }
            }
        } catch (e) {
            console.log("Mindmap JSON parse failed, falling back to Markdown", e);
        }

        // 2. Legacy Markdown Fallback
        nodes.push(root);
        const sections = summary.split(/(?=^## )/m).filter(s => s.trim());

        sections.forEach((section, idx) => {
            const titleMatch = section.match(/^## (.+)/m);
            if (!titleMatch) return;
            const title = titleMatch[1].replace(/[📚🎯📝❓📌⭐⚠️✅📊📈🧠⚡]/g, '').trim();
            const cleanTitle = title.split(':')[0].substring(0, 30);

            const color = branchColors[idx % branchColors.length];
            const nodeId = `node-${idx}`;
            const node: MindMapNode = { id: nodeId, text: cleanTitle, parentId: 'root', children: [], color, depth: 1 };
            nodes.push(node);
            root.children.push(nodeId);

            rightTopics.push(node); // ALL TO RIGHT

            // Children
            const bullets = section.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '));
            bullets.slice(0, 4).forEach((b, bi) => {
                const childText = b.replace(/^[-*]\s+/, '').split(':')[0].split('.')[0].substring(0, 40).trim();
                // Filter empty or very short nodes (likely artifacts)
                if (!childText || childText.length < 2) return;

                const childId = `${nodeId}-${bi}`;
                const child: MindMapNode = { id: childId, text: childText, parentId: nodeId, children: [], color, depth: 2 };
                nodes.push(child);
                node.children.push(childId);
            });
        });

        return { nodes, rootNode: root, leftTopics: [], rightTopics };
    }, [summary, displayTitle]);

    // Mind Map helpers
    const toggleNode = useCallback((id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    // Convert MindMapNode (string[] children) to ExpandedMindMapNode (actual child nodes)
    const expandNode = useCallback((node: MindMapNode, allNodes: MindMapNode[]): ExpandedMindMapNode => {
        const childNodes = node.children
            .map(childId => allNodes.find(n => n.id === childId))
            .filter((n): n is MindMapNode => n !== undefined)
            .map(childNode => expandNode(childNode, allNodes));

        return { ...node, children: childNodes };
    }, []);

    const getVisibleChildren = useCallback((parentId: string): ExpandedMindMapNode[] => {
        const children = nodeLayout.nodes.filter(n => n.parentId === parentId);
        return children.map(child => expandNode(child, nodeLayout.nodes));
    }, [nodeLayout, expandNode]);

    // Expanded versions of root and topics for rendering
    const expandedRoot = useMemo((): ExpandedMindMapNode | null => {
        if (!nodeLayout.rootNode) return null;
        return expandNode(nodeLayout.rootNode, nodeLayout.nodes);
    }, [nodeLayout, expandNode]);

    const expandedRightTopics = useMemo((): ExpandedMindMapNode[] => {
        return nodeLayout.rightTopics.map(topic => expandNode(topic, nodeLayout.nodes));
    }, [nodeLayout, expandNode]);

    return (
        <div className="w-full h-full min-h-[600px] overflow-hidden bg-slate-900 relative rounded-xl border border-white/10"
            onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            }}
            onMouseMove={(e) => {
                if (isDragging) {
                    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
        >
            <div className="absolute bottom-4 right-4 flex gap-2 z-50">
                <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">+</button>
                <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">−</button>
                <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">Reset</button>
            </div>

            <div
                ref={mindMapRef}
                className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out origin-center cursor-move"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                }}
            >
                <MindMapTree
                    root={expandedRoot}
                    rightTopics={expandedRightTopics}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                    getVisibleChildren={getVisibleChildren}
                />
            </div>
        </div>
    );
}
