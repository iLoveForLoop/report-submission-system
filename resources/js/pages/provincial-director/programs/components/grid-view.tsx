import { Program } from '@/types';
import {
    Calendar,
    EllipsisVertical,
    Folders,
    ExternalLink,
    Share2,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function GridView({ programs }: { programs: Program[] }) {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [selectReviewProgram, setSelectReviewProgram] =
        useState<Program | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => {
                const isSelected =
                    program.id === selectReviewProgram?.id;

                return (
                    <div
                        key={program.id}
                        onClick={() =>
                            setSelectReviewProgram(program)
                        }
                        className={cn(
                            'group relative flex cursor-pointer flex-col justify-between rounded-2xl p-5 transition-all duration-300',
                            'shadow-sm hover:-translate-y-1 hover:shadow-md bg-card-elevated dark:bg-card border border-border',
                            isSelected
                                ? 'border-primary ring-1 ring-primary/30 '
                                : 'hover:bg-accent/50'
                        )}
                    >
                        {/* Top Section */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                {/* Icon */}
                                <div
                                    className={cn(
                                        'rounded-xl p-2.5 transition-colors',
                                        isSelected
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    <Folders className="h-5 w-5" />
                                </div>

                                {/* Menu */}
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(
                                                activeMenu === program.id
                                                    ? null
                                                    : program.id
                                            );
                                        }}
                                        className="rounded-full p-1.5 opacity-40 transition-all hover:bg-accent group-hover:opacity-100"
                                    >
                                        <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
                                    </button>

                                    {/* Dropdown */}
                                    {activeMenu === program.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(null);
                                                }}
                                            />

                                            <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl">
                                                {[
                                                    {
                                                        label: 'Open',
                                                        icon: ExternalLink,
                                                    },
                                                    {
                                                        label: 'Share',
                                                        icon: Share2,
                                                    },
                                                    {
                                                        label: 'Rename',
                                                        icon: Pencil,
                                                    },
                                                ].map((action) => (
                                                    <button
                                                        key={action.label}
                                                        className="group/item flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                                    >
                                                        <span className="truncate">
                                                            {action.label}
                                                        </span>
                                                        <action.icon className="h-4 w-4 text-muted-foreground opacity-60 transition-opacity group-hover/item:opacity-100" />
                                                    </button>
                                                ))}

                                                <div className="my-1 border-t border-border" />

                                                <button className="group/item flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                                                    <span>Delete</span>
                                                    <Trash2 className="h-4 w-4 opacity-70 group-hover/item:opacity-100" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h2 className="text-base font-semibold tracking-tight text-foreground">
                                    {program.name}
                                </h2>
                                {program.description && (
                                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                        {program.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                            {program.coordinator ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                                        {getInitials(
                                            program.coordinator.name
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {program.coordinator.name}
                                    </span>
                                </div>
                            ) : (
                                <div />
                            )}

                            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {formatDate(program.updated_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
