import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    ExternalLink,
    FileSpreadsheet,
    FileText,
    Maximize2,
    RotateCw,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ModalState, isImage, isSpreadsheet } from './file-preview-types';
import { SpreadsheetPreview } from './spread-sheet-preview';

interface Props {
    state: ModalState;
    onClose: () => void;
    onNavigate: (indexOrDir: number | 'prev' | 'next') => void;
}

export function FilePreviewModal({ state, onClose, onNavigate }: Props) {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const { item, allItems, currentIndex } = state;
    if (!item) return null;

    const itemIsImage = isImage(item.mime_type);
    const itemIsSheet = isSpreadsheet(item.mime_type, item.name);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allItems.length - 1;

    const resetView = () => {
        setZoom(1);
        setRotation(0);
    };

    useEffect(() => {
        resetView();
    }, [item.id]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && hasPrev) onNavigate('prev');
            if (e.key === 'ArrowRight' && hasNext) onNavigate('next');
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [hasPrev, hasNext, onClose, onNavigate]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative flex h-[90vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-background shadow-2xl">
                {/* ── Header ── */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                        {itemIsSheet ? (
                            <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                        )}
                        <span className="truncate text-sm font-medium">
                            {item.name}
                        </span>
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                            {item.name.split('.').pop()}
                        </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {/* Image controls */}
                        {itemIsImage && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                        setZoom((z) => Math.max(0.25, z - 0.25))
                                    }
                                    title="Zoom out"
                                >
                                    <ZoomOut className="h-3.5 w-3.5" />
                                </Button>
                                <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                        setZoom((z) => Math.min(4, z + 0.25))
                                    }
                                    title="Zoom in"
                                >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() =>
                                        setRotation((r) => (r + 90) % 360)
                                    }
                                    title="Rotate"
                                >
                                    <RotateCw className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={resetView}
                                    title="Reset view"
                                >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                </Button>
                                <div className="mx-1 h-4 w-px bg-border" />
                            </>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild
                            title="Open in new tab"
                        >
                            <a
                                href={item.original_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            asChild
                            title="Download"
                        >
                            <a href={item.original_url} download={item.name}>
                                <Download className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                        <div className="mx-1 h-4 w-px bg-border" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={onClose}
                            title="Close (Esc)"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/20 p-4">
                    {itemIsImage ? (
                        <div className="flex h-full w-full items-center justify-center overflow-auto">
                            <img
                                src={item.original_url}
                                alt={item.name}
                                style={{
                                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                    transformOrigin: 'center',
                                    transition: 'transform 0.2s ease',
                                    maxWidth: zoom === 1 ? '100%' : 'none',
                                    maxHeight: zoom === 1 ? '100%' : 'none',
                                }}
                                className="rounded shadow-md"
                            />
                        </div>
                    ) : itemIsSheet ? (
                        <SpreadsheetPreview item={item} />
                    ) : (
                        /* Unsupported file type */
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="rounded-2xl bg-muted p-6">
                                <FileText className="h-16 w-16 text-muted-foreground/40" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {item.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Preview is not available for this file type.
                                </p>
                            </div>
                            <Button asChild size="sm" className="gap-2">
                                <a
                                    href={item.original_url}
                                    download={item.name}
                                >
                                    <Download className="h-4 w-4" /> Download
                                    File
                                </a>
                            </Button>
                        </div>
                    )}

                    {/* Prev / Next */}
                    {hasPrev && (
                        <button
                            onClick={() => onNavigate('prev')}
                            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full border bg-background/80 p-1.5 shadow backdrop-blur-sm transition hover:bg-background"
                            title="Previous (←)"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}
                    {hasNext && (
                        <button
                            onClick={() => onNavigate('next')}
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full border bg-background/80 p-1.5 shadow backdrop-blur-sm transition hover:bg-background"
                            title="Next (→)"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* ── Thumbnail strip ── */}
                {allItems.length > 1 && (
                    <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t bg-muted/30 px-4 py-2">
                        {allItems.map((f, i) => (
                            <button
                                key={f.id}
                                onClick={() => onNavigate(i)}
                                className={`shrink-0 rounded border-2 transition ${
                                    i === currentIndex
                                        ? 'border-primary'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                {isImage(f.mime_type) ? (
                                    <img
                                        src={f.original_url}
                                        alt={f.name}
                                        className="h-10 w-14 rounded object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-14 flex-col items-center justify-center gap-0.5 rounded bg-muted px-1">
                                        {isSpreadsheet(f.mime_type, f.name) ? (
                                            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                                            {f.name
                                                .split('.')
                                                .pop()
                                                ?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
