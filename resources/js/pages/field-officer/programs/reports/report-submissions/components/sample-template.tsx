import { Button } from '@/components/ui/button';
import { Media } from '@/types';
import { Download, FileText } from 'lucide-react';

interface Props {
    templates: Media[];
}
export default function SampleTemplate({ templates }: Props) {
    return (
        <div className="rounded-lg border bg-gradient-to-br from-background to-muted/20 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">Sample Template</h2>
            </div>

            {templates?.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {templates?.map((temp) => (
                        <div
                            key={temp.id}
                            className="group relative overflow-hidden rounded-md border bg-background transition-all hover:shadow-md"
                        >
                            {temp.mime_type.startsWith('image/') ? (
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={temp.original_url}
                                        alt={temp.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="absolute right-2 bottom-2 left-2">
                                            <p className="truncate text-xs font-medium text-white">
                                                {temp.name}
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
                                        {temp.name}
                                    </p>
                                    <div className="flex gap-1">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="h-7 gap-1 text-xs"
                                        ></Button>
                                        <Button
                                            asChild
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 gap-1 text-xs"
                                        >
                                            <a href={temp.original_url} download>
                                                <Download className="h-3 w-3" />
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 py-8">
                    <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">
                        No sample template provided
                    </p>
                </div>
            )}
        </div>
    );
}
