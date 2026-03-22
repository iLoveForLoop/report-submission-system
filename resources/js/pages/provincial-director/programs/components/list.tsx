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

export default function ListView({
    programs,
    selectReviewProgram,
    setSelecReviewProgram,
}: Props) {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border dark:border-gray-700">
            {/* Header — hidden on mobile */}
            <div className="hidden grid-cols-12 gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid dark:border-gray-700 dark:bg-gray-800/50">
                <div className="col-span-5">Name</div>
                <div className="col-span-4">Coordinator</div>
                <div className="col-span-2">Description</div>
                <div className="col-span-1" />
            </div>

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
                            'cursor-pointer border-b transition-colors last:border-b-0 dark:border-gray-700',
                            isSelected
                                ? 'bg-muted dark:bg-gray-800'
                                : 'hover:bg-muted/50 dark:hover:bg-gray-800/50',
                        )}
                    >
                        {/* Mobile layout */}
                        <div className="flex items-center gap-3 px-4 py-3 sm:hidden">
                            <div className="rounded-lg bg-muted p-2 dark:bg-gray-800">
                                <Folders className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground dark:text-white">
                                    {program.name}
                                </p>
                                {program.coordinator && (
                                    <p className="truncate text-xs text-muted-foreground dark:text-gray-400">
                                        {program.coordinator.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Desktop table layout */}
                        <div className="hidden grid-cols-12 items-center gap-4 px-4 py-3 sm:grid">
                            <div className="col-span-5 flex min-w-0 items-center gap-2">
                                <div className="flex-shrink-0 rounded-md bg-muted p-1.5 dark:bg-gray-800">
                                    <Folders className="h-3.5 w-3.5 text-muted-foreground dark:text-gray-400" />
                                </div>
                                <span className="truncate text-sm font-medium text-foreground dark:text-white">
                                    {program.name}
                                </span>
                            </div>

                            <div className="col-span-4 flex min-w-0 items-center gap-2">
                                {program.coordinator && (
                                    <>
                                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground dark:bg-gray-700 dark:text-gray-300">
                                            {program.coordinator.name.charAt(0)}
                                        </div>
                                        <span className="truncate text-sm text-muted-foreground dark:text-gray-400">
                                            {program.coordinator.name}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="col-span-2 truncate text-sm text-muted-foreground dark:text-gray-400">
                                {program.description ?? (
                                    <span className="text-muted-foreground/40 italic">
                                        —
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
