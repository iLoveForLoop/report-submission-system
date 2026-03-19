// components/header.tsx
import { FilterType } from '@/types';
import { router } from '@inertiajs/react';
import { FileCheck, Grid2x2, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface HeaderProps {
    activeFilter?: FilterType;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export default function Header({
    activeFilter = 'all',
    viewMode,
    onViewModeChange,
}: HeaderProps) {
    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'returned', label: 'Returned' },
        { key: 'accepted', label: 'Accepted' },
    ];

    const handleFilterClick = (filter: FilterType) => {
        router.get(window.location.pathname, { filter });
    };

    return (
        <div className="mb-4">
            {/* Title */}
            <div className="mb-4">
                <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground lg:text-2xl">
                    <FileCheck className="h-5 w-5 text-primary" />
                    My Report Submissions
                </h1>
                <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                    View and manage all your report submissions
                </p>
            </div>

            {/* Filter tabs + view toggle on same row */}
            <div className="flex items-end justify-between border-b border-border">
                {/* Underline filter tabs */}
                <div className="flex gap-1">
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter.key;
                        return (
                            <button
                                key={filter.key}
                                onClick={() => handleFilterClick(filter.key)}
                                className={`relative px-4 py-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none lg:text-sm ${
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {filter.label}
                                {isActive && (
                                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* View mode toggle — sits above the border line */}
                <div className="mb-2 flex items-center gap-1 rounded-lg border bg-background p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`rounded p-2 transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title="Grid view"
                    >
                        <Grid2x2 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`rounded p-2 transition-colors ${
                            viewMode === 'list'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title="List view"
                    >
                        <List className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
