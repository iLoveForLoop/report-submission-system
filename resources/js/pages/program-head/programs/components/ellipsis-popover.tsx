import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Program } from '@/types';
import { Link } from '@inertiajs/react';
import { EllipsisVertical, ExternalLink, Pencil } from 'lucide-react';
import { useState } from 'react';
import DeleteProgramDialog from './delete-dialog';

export default function EllipsisPopover({ program }: { program: Program }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <Link className="flex items-center gap-3">
                        <ExternalLink className="h-4 w-4" />
                        <span>Open</span>
                    </Link>
                </div>
                <div>
                    <Link className="flex items-center gap-3">
                        <Pencil className="h-4 w-4" />
                        <span>Edit</span>
                    </Link>
                </div>
                <div>
                    <DeleteProgramDialog
                        program={program}
                        setOpenPop={setOpen}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
