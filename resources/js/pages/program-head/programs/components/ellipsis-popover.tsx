import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Program, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { EllipsisVertical, ExternalLink, Pencil } from 'lucide-react';
import { useState } from 'react';
import DeleteProgramDialog from './delete-dialog';
import EditProgramDialog from './edit-dialog';
import { cn } from '@/lib/utils';

export default function EllipsisPopover({ program }: { program: Program }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const { coordinators } = usePage<{
        coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    }>().props;

    const menuItems = [
        {
            label: 'Open',
            icon: ExternalLink,
            onClick: () => {
                setOpen(false);
                router.visit(ViewController.reports(program));
            }
        },
        {
            label: 'Edit',
            icon: Pencil,
            onClick: () => {
                setOpen(false);
                setEditOpen(true);
            }
        }
    ];

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        className={cn(
                            "rounded-full p-1.5 transition-all outline-none",
                            "text-slate-400 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800",
                            // Fix: Ensure it's visible in dark mode, more prominent when popover is open
                            open ? "bg-slate-100 opacity-100 text-primary" : "opacity-60 hover:opacity-100"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-48 overflow-hidden rounded-xl border-slate-200 dark:bg-black p-1.5 shadow-xl dark:border-0"
                    align="end"
                    sideOffset={8}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col gap-0.5">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className="group/item flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                <span>{item.label}</span>
                                <item.icon className="h-4 w-4 opacity-40 transition-opacity group-hover/item:opacity-100 dark:text-gray-400 dark:group-hover/item:text-primary" />
                            </button>
                        ))}

                        <div className="my-1 border-t border-slate-100 dark:border-gray-800" />

                        <div className="rounded-lg transition-colors hover:bg-destructive/10">
                            <DeleteProgramDialog
                                program={program}
                                setOpenPop={setOpen}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <EditProgramDialog
                program={program}
                coordinators={coordinators}
                open={editOpen}
                setOpen={setOpen} // or setEditOpen depending on your logic
            />
        </>
    );
}
