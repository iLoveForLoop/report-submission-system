import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import FilterBtn from '@/components/filter';
import { FlashToaster } from '@/components/flash-toaster';
import ProgramGridSkeleton from '@/components/skeleton-loader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Program, User, type BreadcrumbItem } from '@/types';
import { Deferred, Head, usePage, useRemember } from '@inertiajs/react';
import { Eye, EyeClosed } from 'lucide-react';
import { Activity, useState } from 'react';
import ToggleGridList from '../../../components/toggle-list-grid';
import EmptyProgram from './components/empty-programs';
import GridView from './components/grid';
import ListView from './components/list';
import ProgramDialog from './components/program-dialog';
import ReviewProgram from './components/review';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: ViewController.programs().url,
    },
];

export default function ProgramsPage() {
    const [open, setOpen] = useState<boolean>(false);
    const [isList, setIsList] = useRemember<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const [selectReviewProgram, setSelecReviewProgram] =
        useState<Program | null>();
    const [reviewOpen, setReviewOpen] = useState<boolean>(true);

    const { programs } = usePage<{ programs: Program[] }>().props;

    const { coordinators } = usePage<{
        coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    }>().props;

    const filteredPrograms = selectedYear
        ? programs.filter(
              (p) => new Date(p.created_at).getFullYear() === selectedYear,
          )
        : programs;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />

            <FlashToaster />

            <div
                className="flex h-full flex-1 flex-col gap-2 rounded-xl"
                onClick={(e) => {
                    if (e.target === e.currentTarget)
                        setSelecReviewProgram(null);
                }}
            >
                {/* Action Buttons - Responsive */}
                <div className="mt-4 flex flex-col gap-2 px-4 sm:flex-row sm:justify-end sm:gap-2">
                    <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
                        <ProgramDialog
                            coordinators={coordinators}
                            open={open}
                            setOpen={setOpen}
                        />
                        <Button
                            onClick={() => {
                                setReviewOpen((prev) => !prev);
                            }}
                            variant={'outline'}
                            className="flex-1 sm:flex-none"
                        >
                            {reviewOpen ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="hidden sm:inline">
                                {reviewOpen ? 'Hide' : 'Show'} Preview
                            </span>
                            <span className="sm:hidden">
                                {reviewOpen ? 'Hide' : 'Show'}
                            </span>
                        </Button>
                        <FilterBtn onSelect={setSelectedYear} />
                        <ToggleGridList isList={isList} setIsList={setIsList} />
                    </div>
                </div>

                <div
                    className="relative h-full overflow-hidden border-t p-2 sm:p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setSelecReviewProgram(null);
                    }}
                >
                    <Deferred
                        data={'programs'}
                        fallback={<ProgramGridSkeleton />}
                    >
                        <ScrollArea className="relative h-[500px] w-full sm:h-[600px]">
                            <div
                                className={cn(
                                    'transition-all duration-300 ease-in-out',
                                    reviewOpen
                                        ? 'sm:mr-[350px]'
                                        : 'sm:mr-0',
                                    'mr-0' // No margin on mobile
                                )}
                            >
                                <div className="px-2 sm:px-0">
                                    <h1 className="mb-3 font-semibold text-foreground">
                                        All Programs
                                    </h1>
                                </div>
                                <div>
                                    <Activity
                                        mode={
                                            programs?.length === 0
                                                ? 'visible'
                                                : 'hidden'
                                        }
                                    >
                                        <EmptyProgram setIsOpen={setOpen} />
                                    </Activity>

                                    <Activity
                                        mode={
                                            programs?.length > 0
                                                ? 'visible'
                                                : 'hidden'
                                        }
                                    >
                                        {isList ? (
                                            <ListView
                                                programs={filteredPrograms}
                                                selectReviewProgram={
                                                    selectReviewProgram
                                                }
                                                setSelecReviewProgram={
                                                    setSelecReviewProgram
                                                }
                                            />
                                        ) : (
                                            <GridView
                                                programs={filteredPrograms}
                                                selectReviewProgram={
                                                    selectReviewProgram
                                                }
                                                setSelecReviewProgram={
                                                    setSelecReviewProgram
                                                }
                                            />
                                        )}
                                    </Activity>
                                </div>
                            </div>
                        </ScrollArea>
                    </Deferred>

                    {/* Review Panel - Responsive Slide */}
                    <div
                        className={cn(
                            'fixed bottom-0 right-0 top-auto z-50 h-[50vh] w-full border-l bg-background transition-transform duration-300 ease-in-out sm:absolute sm:top-0 sm:h-full sm:w-[350px]',
                            reviewOpen
                                ? 'translate-y-0 sm:translate-x-0'
                                : 'translate-y-full sm:translate-y-0 sm:translate-x-full',
                            'rounded-t-xl border-t shadow-lg sm:rounded-none sm:border-t-0 sm:shadow-none'
                        )}
                    >
                        <ReviewProgram program={selectReviewProgram} />

                        {/* Mobile Close Handle */}
                        {reviewOpen && (
                            <button
                                onClick={() => setReviewOpen(false)}
                                className="absolute top-2 right-2 rounded-full bg-muted p-1.5 sm:hidden"
                            >
                                <EyeClosed className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
