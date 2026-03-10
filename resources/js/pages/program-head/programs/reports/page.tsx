import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Program, Report } from '@/types';
import { Deferred, Link, usePage } from '@inertiajs/react';
import { EllipsisVertical, Folder } from 'lucide-react';
import { Activity, useState } from 'react';
import ReportDialog from './components/report-dialog';

export default function Reports() {
    const { reports, program } = usePage<{
        reports: Report[];
        program: Program;
    }>().props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Reports`,
            href: ViewController.programs().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Back link={ViewController.programs()} />
                <h1 className="font-semibold lg:text-2xl">All Reports </h1>
                <ReportDialog
                    program={program}
                    open={isOpen}
                    setOpen={setIsOpen}
                />

                <Activity mode={reports?.length === 0 ? 'visible' : 'hidden'}>
                    <div className="flex h-[60vh] items-center justify-center">
                        <div>
                            <img
                                src="/Images/no-report.svg"
                                alt="No report"
                                className="mb-2 h-30 dark:opacity-45"
                            />
                            <p className="text-center text-gray-500">
                                No reports yet
                            </p>
                        </div>
                    </div>
                </Activity>

                <Deferred
                    data={'reports'}
                    fallback={() => <div>Loading...</div>}
                >
                    <Activity mode={reports?.length > 0 ? 'visible' : 'hidden'}>
                        <div className="grid grid-rows-1 gap-5 lg:grid-cols-3">
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
                                                {report.title}
                                            </h2>
                                            <p className="text-xs text-muted-foreground lg:text-sm">
                                                Deadline:{' '}
                                                {new Date(
                                                    report.created_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="">
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
