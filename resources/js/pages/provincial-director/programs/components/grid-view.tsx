import ViewController from '@/actions/App/Http/Controllers/ProvincialDirector/ViewController';
import { cn } from '@/lib/utils';
import { Program } from '@/types';
import { router } from '@inertiajs/react';
import { Folders } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    programs: Program[];
    selectReviewProgram: Program | null | undefined;
    setSelecReviewProgram: Dispatch<SetStateAction<Program | null | undefined>>;
}

export default function GridView({
    programs,
    selectReviewProgram,
    setSelecReviewProgram,
}: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => {
                const isSelected = program.id === selectReviewProgram?.id;

                return (
                    <div
                        key={index}
                        onClick={() => setSelecReviewProgram(program)}
                        onDoubleClick={() =>
                            router.visit(ViewController.reports(program))
                        }
                        className={cn(
                            'group relative flex cursor-pointer flex-col justify-between rounded-2xl p-5 transition-all duration-300',
                            'border bg-card shadow-sm hover:-translate-y-1 hover:shadow-md',
                            isSelected
                                ? 'border-primary bg-primary/[0.03] ring-1 ring-primary/30 dark:bg-primary/[0.08]'
                                : 'border-slate-200/60 dark:border-gray-800 dark:bg-gray-900/50',
                        )}
                    >
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div
                                    className={cn(
                                        'rounded-xl p-2.5 transition-colors',
                                        isSelected
                                            ? 'bg-primary text-white dark:text-primary-foreground'
                                            : 'bg-muted text-slate-500 dark:bg-gray-800 dark:text-gray-400',
                                    )}
                                >
                                    <Folders className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-base font-semibold tracking-tight text-foreground dark:text-slate-100">
                                    {program.name}
                                </h2>
                                {program.description && (
                                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground dark:text-slate-400">
                                        {program.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Coordinator Section with enhanced contrast */}
                        {program.coordinator && (
                            <div className="mt-6 flex items-center gap-2 border-t border-border/50 pt-4 dark:border-gray-800/60">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary dark:bg-primary/20 dark:text-primary-foreground/90">
                                    {program.coordinator.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {program.coordinator.name}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
