import { Button } from '@/components/ui/button';
import { Media } from '@/types';
import {
    Download,
    FileSpreadsheet,
    FileText,
    Table,
    ZoomIn,
} from 'lucide-react';
import { isImage, isSpreadsheet } from './file-preview-types';

interface Props {
    item: Media;
    onPreview: () => void;
}

export function MediaCard({ item, onPreview }: Props) {
    const itemIsImage = isImage(item.mime_type);
    const itemIsSheet = isSpreadsheet(item.mime_type, item.name);

    return (
        <div className="group relative overflow-hidden rounded-md border bg-background transition-all hover:shadow-md">
            {itemIsImage ? (
                <div
                    className="relative aspect-video cursor-zoom-in overflow-hidden"
                    onClick={onPreview}
                >
                    <img
                        src={item.original_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                        <ZoomIn className="h-6 w-6 scale-75 text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
                    </div>
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
                    <div
                        className={`rounded-full p-2 ${
                            itemIsSheet ? 'bg-emerald-500/10' : 'bg-primary/10'
                        }`}
                    >
                        {itemIsSheet ? (
                            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <FileText className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    <p className="w-full truncate px-1 text-center text-xs font-medium">
                        {item.name}
                    </p>
                    <div className="flex gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={onPreview}
                        >
                            {itemIsSheet ? (
                                <>
                                    <Table className="h-3 w-3" /> View
                                </>
                            ) : (
                                <>
                                    <ZoomIn className="h-3 w-3" /> View
                                </>
                            )}
                        </Button>
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                        >
                            <a href={item.original_url} download={item.name}>
                                <Download className="h-3 w-3" /> Download
                            </a>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
