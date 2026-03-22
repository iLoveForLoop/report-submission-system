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
    <div className="animate-pulse space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl border p-4">
                <div className="mb-2 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted" />
                    <div className="h-4 w-1/3 rounded bg-muted" />
                </div>
                <div className="mb-1.5 h-3 w-full rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
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
    const { mode, updateMode } = useViewMode();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col overflow-hidden">
                <Header
                    activeFilter={filter}
                    viewMode={mode}
                    onViewModeChange={updateMode}
                />
                <div className="flex-1 overflow-auto">
                    <WhenVisible
                        data="mySubmissions"
                        fallback={<SkeletonLoading />}
                    >
                        <div className="p-4">
                            <Submissions
                                submissions={mySubmissions}
                                filter={filter}
                                viewMode={mode}
                            />
                        </div>
                    </WhenVisible>
                </div>
            </div>
        </AppLayout>
    );
}
