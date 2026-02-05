// components/ui/pagination.tsx
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { LaravelPaginator } from '@/types';

interface PaginationProps {
    paginator: LaravelPaginator<unknown>;
    filters?: Record<string, unknown>;
}

export function Pagination({ paginator, filters = {} }: PaginationProps) {
    const { current_page, last_page, from, to, total, links } = paginator;

    const handlePageChange = (page: number) => {
        if (page === current_page || page < 1 || page > last_page) return;

        router.get(window.location.pathname, {
            page,
            ...filters,
        });
    };

    if (last_page <= 1) return null;

    return (
        <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{from}</span> to{' '}
                    <span className="font-medium">{to}</span> of{' '}
                    <span className="font-medium">{total}</span> results
                </div>

                <div className="flex items-center space-x-2">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        {/* Previous button */}
                        <button
                            onClick={() => handlePageChange(current_page - 1)}
                            disabled={!paginator.prev_page_url}
                            className="relative inline-flex items-center rounded-l-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground ring-1 ring-inset ring-border hover:bg-accent hover:text-accent-foreground focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Page numbers */}
                        {links.map((link, index) => {
                            if (link.label === '...') {
                                return (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center border border-border bg-background px-4 py-2 text-sm font-medium text-foreground ring-1 ring-inset ring-border"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </span>
                                );
                            }

                            const pageNumber = link.label === '&laquo; Previous'
                                ? current_page - 1
                                : link.label === 'Next &raquo;'
                                    ? current_page + 1
                                    : parseInt(link.label);

                            if (isNaN(pageNumber)) return null;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`relative inline-flex items-center border border-border px-4 py-2 text-sm font-medium ring-1 ring-inset ring-border focus:z-20 focus:outline-offset-0 ${
                                        link.active
                                            ? 'z-10 bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                            : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        {/* Next button */}
                        <button
                            onClick={() => handlePageChange(current_page + 1)}
                            disabled={!paginator.next_page_url}
                            className="relative inline-flex items-center rounded-r-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground ring-1 ring-inset ring-border hover:bg-accent hover:text-accent-foreground focus:z-20 focus:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
