import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import ToggleGridList from '@/components/toggle-list-grid';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, Program } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FilterBtn from '../../../components/filter';
import GriddView from './components/grid-view';
import ListView from './components/list-view';
import { FolderOpen } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: ViewController.programs().url,
    },
];

export default function Programs() {
    const [isList, setIsList] = useState<boolean>(false);
    const [isFiltering, setIsFiltering] = useState<boolean>(false);

    const { programs, filters } = usePage<{
        programs: LaravelPaginator<Program>;
        filters?: { year?: number };
    }>().props;

    const [selectedYear, setSelectedYear] = useState<number | null>(
        filters?.year || null,
    );

    // Handle year filter
    const handleYearFilter = (year: number | null) => {
        setSelectedYear(year);
        setIsFiltering(true);

        const params: any = { page: 1 }; // Reset to page 1

        if (year) {
            params.year = year;
        }

        router.get(route('programs.index'), params, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    // Show loading when filtering or initial load
    const isLoading = isFiltering || (programs.data.length === 0 && !filters);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-center text-xl font-semibold sm:text-2xl">
                        All Programs
                    </h1>
                    <div className="flex items-center gap-3">
                        <FilterBtn
                            onSelect={handleYearFilter}
                            selectedYear={selectedYear}
                        />
                        <ToggleGridList isList={isList} setIsList={setIsList} />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                )}

                {/* No Results */}
                {!isLoading && programs.data.length === 0 && (
                    <div className="py-12 text-center">
                        <div className='flex flex-col gap-2 items-center justify-center h-[50vh]'>
                            <FolderOpen className='text-muted-foreground' />
                            <h1 className="text-sm md:text-lg text-muted-foreground">
                                {selectedYear
                                    ? `No programs found for ${selectedYear}`
                                    : 'No programs yet'}
                            </h1>
                        </div>

                        {selectedYear && (
                            <button
                                onClick={() => handleYearFilter(null)}
                                className="mt-2 text-primary hover:underline"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                )}

                {/* Programs List/Grid View */}
                {!isLoading && programs.data.length > 0 && (
                    <>
                        <div className="text-sm text-muted-foreground">
                            Showing{' '}
                            <span className="font-medium">{programs.from}</span>{' '}
                            to{' '}
                            <span className="font-medium">{programs.to}</span>{' '}
                            of{' '}
                            <span className="font-medium">
                                {programs.total}
                            </span>{' '}
                            results
                            {selectedYear && ` from ${selectedYear}`}
                        </div>

                        {isList ? (
                            <ListView programs={programs.data} />
                        ) : (
                            <GriddView programs={programs.data} />
                        )}
                    </>
                )}

                {/* Pagination Component - It handles its own navigation */}
                {!isLoading &&
                    programs.data.length > 0 &&
                    programs.last_page > 1 && (
                        <Pagination
                            paginator={programs}
                            filters={selectedYear ? { year: selectedYear } : {}}
                        />
                    )}
            </div>
        </AppLayout>
    );
}
