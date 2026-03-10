import { Media } from '@/types';
import { BookOpen, FileText } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FilePreviewModal } from './file-preview-modal';
import { ModalState } from './file-preview-types';
import { MediaCard } from './media-card';

interface Props {
    templates: Media[];
    references: Media[];
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 py-8">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

export default function SampleTemplate({ templates, references }: Props) {
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        item: null,
        allItems: [],
        currentIndex: 0,
    });

    const openModal = useCallback((item: Media, scope: Media[]) => {
        const index = scope.findIndex((f) => f.id === item.id);
        setModal({ isOpen: true, item, allItems: scope, currentIndex: index });
    }, []);

    const closeModal = useCallback(() => {
        setModal((prev) => ({ ...prev, isOpen: false, item: null }));
    }, []);

    const navigate = useCallback((indexOrDir: number | 'prev' | 'next') => {
        setModal((prev) => {
            let next: number;
            if (indexOrDir === 'prev') next = prev.currentIndex - 1;
            else if (indexOrDir === 'next') next = prev.currentIndex + 1;
            else next = indexOrDir;

            if (next < 0 || next >= prev.allItems.length) return prev;
            return { ...prev, currentIndex: next, item: prev.allItems[next] };
        });
    }, []);

    useEffect(() => {
        document.body.style.overflow = modal.isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [modal.isOpen]);

    return (
        <>
            <div className="rounded-lg border bg-gradient-to-br from-background to-muted/20 p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Templates */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h2 className="text-base font-semibold">
                                Sample Template
                            </h2>
                        </div>
                        {templates?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {templates.map((temp) => (
                                    <MediaCard
                                        key={temp.id}
                                        item={temp}
                                        onPreview={() =>
                                            openModal(temp, templates)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState label="No sample template provided" />
                        )}
                    </div>

                    {/* References */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <h2 className="text-base font-semibold">
                                References
                            </h2>
                        </div>
                        {references?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {references.map((ref) => (
                                    <MediaCard
                                        key={ref.id}
                                        item={ref}
                                        onPreview={() =>
                                            openModal(ref, references)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState label="No references provided" />
                        )}
                    </div>
                </div>
            </div>

            {modal.isOpen && (
                <FilePreviewModal
                    state={modal}
                    onClose={closeModal}
                    onNavigate={navigate}
                />
            )}
        </>
    );
}
