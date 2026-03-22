import { FilterType } from '@/types';
import { router } from '@inertiajs/react';
import { FileCheck, Grid2x2, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface HeaderProps {
    activeFilter?: FilterType;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'returned', label: 'Returned' },
    { key: 'accepted', label: 'Accepted' },
];

export default function Header({
    activeFilter = 'all',
    viewMode,
    onViewModeChange,
}: HeaderProps) {
    const handleFilterClick = (filter: FilterType) => {
        router.get(window.location.pathname, { filter });
    };

    return (
        <div className="flex flex-col">
            {/* Title row */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-primary" />
                    <h1 className="text-sm font-semibold text-foreground dark:text-white">
                        My Report Submissions
                    </h1>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center gap-1 rounded-lg border bg-background p-1 dark:border-gray-700">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`rounded p-1.5 transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title="Grid view"
                    >
                        <Grid2x2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`rounded p-1.5 transition-colors ${
                            viewMode === 'list'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                        title="List view"
                    >
                        <List className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b px-4 dark:border-gray-700">
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.key;
                    return (
                        <button
                            key={filter.key}
                            onClick={() => handleFilterClick(filter.key)}
                            className={`relative shrink-0 px-3 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none sm:px-4 sm:text-sm ${
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
        </div>
    );
}
