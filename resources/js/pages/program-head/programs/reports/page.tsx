import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';
import { Report } from '@/types';
import { Deferred, Link, usePage } from '@inertiajs/react';
import { EllipsisVertical, Folder } from 'lucide-react';
import { Activity } from 'react';

export default function Reports() {
    const { reports } = usePage<{
        reports: Report[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <Back link={ViewController.programs()} />

                    <h1 className="text-2xl font-semibold">All Reports </h1>
                    <div></div>
                </div>
                <Activity mode={reports?.length === 0 ? 'visible' : 'hidden'}>
                    No reports yet
                </Activity>

                <Deferred
                    data={'reports'}
                    fallback={() => <div>Loading...</div>}
                >
                    <Activity mode={reports?.length > 0 ? 'visible' : 'hidden'}>
                        <div className="grid grid-cols-3 gap-5">
                            {reports?.map((report, index) => (
                                <Link
                                    href={ViewController.submissions(report)}
                                    key={index}
                                    className="flex items-center gap-5 rounded-xl border bg-background/50 px-4 py-2"
                                >
                                    <div>
                                        <Folder />
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <div>
                                            <h2 className="truncate text-lg font-semibold">
                                                {report.title} with bipop
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                Deadline:{' '}
                                                {new Date(
                                                    report.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Activity>
                </Deferred>
            </div>
        </AppLayout>
    );
}
