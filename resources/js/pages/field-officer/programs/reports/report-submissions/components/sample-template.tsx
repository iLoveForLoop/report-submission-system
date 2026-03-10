import { Button } from '@/components/ui/button';
import { Media } from '@/types';
import { BookOpen, Download, FileText } from 'lucide-react';

interface Props {
    templates: Media[];
    references: Media[];
}

function MediaCard({ item }: { item: Media }) {
    return (
        <div className="group relative overflow-hidden rounded-md border bg-background transition-all hover:shadow-md">
            {item.mime_type.startsWith('image/') ? (
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={item.original_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute right-2 bottom-2 left-2">
                            <p className="truncate text-xs font-medium text-white">
                                {item.name}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <p className="truncate text-center text-xs font-medium">
                        {item.name}
                    </p>
                    <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                    >
                        <a href={item.original_url} download>
                            <Download className="h-3 w-3" />
                            Download
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
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
    return (
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
                                <MediaCard key={temp.id} item={temp} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState label="No sample template provided" />
                    )}
                </div>

                {/* Divider — horizontal on mobile, vertical on md+ */}
                {/* <div className="border-t md:hidden" />
                    <div className="absolute top-4 bottom-4 left-1/2 hidden w-px bg-border md:block" /> */}

                {/* References */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h2 className="text-base font-semibold">References</h2>
                    </div>

                    {references?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {references.map((ref) => (
                                <MediaCard key={ref.id} item={ref} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState label="No references provided" />
                    )}
                </div>
            </div>
        </div>
    );
}
