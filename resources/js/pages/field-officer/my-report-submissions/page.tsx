import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    FilterType,
    LaravelPaginator,
    ReportSubmission,
} from '@/types';
import { WhenVisible } from '@inertiajs/react';
import Header from './components/header';
import Submissions from './submissions';

const SkeletonLoading = () => (
    <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
                <div className="mb-2 h-5 w-1/3 rounded bg-muted"></div>
                <div className="mb-1 h-4 w-full rounded bg-muted"></div>
                <div className="h-4 w-2/3 rounded bg-muted"></div>
            </div>
        ))}
    </div>
);

interface MyReportsProps {
    mySubmissions?: LaravelPaginator<ReportSubmission>;
    filter?: FilterType;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Report Submissions',
        href: ViewController.myReportSubmissions().url,
    },
];

export default function MyReports({
    mySubmissions,
    filter = 'all',
}: MyReportsProps) {
    // ── Single source of truth for view mode ──────────────────────────────────
    const { mode, updateMode } = useViewMode();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header
                    activeFilter={filter}
                    viewMode={mode}
                    onViewModeChange={updateMode}
                />
                <WhenVisible
                    data={'mySubmissions'}
                    fallback={<SkeletonLoading />}
                >
                    <Submissions
                        submissions={mySubmissions}
                        filter={filter}
                        viewMode={mode}
                    />
                </WhenVisible>
            </div>
        </AppLayout>
    );
}
