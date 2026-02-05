import AppLayout from '@/layouts/app-layout';
import { WhenVisible } from '@inertiajs/react';
import { breadcrumbs } from '../dashboard/page';
import Header from './components/header';
import Submissions from './submissions';
import { LaravelPaginator, ReportSubmission, FilterType } from '@/types';

const SkeletonLoading = () => (
    <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        ))}
    </div>
);

interface MyReportsProps {
    mySubmissions?: LaravelPaginator<ReportSubmission>;
    filter?: FilterType;
}

export default function MyReports({ mySubmissions, filter = 'all' }: MyReportsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header activeFilter={filter} />
                <WhenVisible
                    data={'mySubmissions'}
                    fallback={<SkeletonLoading />}
                >
                    <Submissions
                        submissions={mySubmissions}
                        filter={filter}
                    />
                </WhenVisible>
            </div>
        </AppLayout>
    );
}
