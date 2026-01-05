import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { Program, Report } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { EllipsisVertical, Folder } from 'lucide-react';
import { Activity, useState } from 'react';
import { breadcrumbs } from '../../dashboard/page';
import EmptyReport from '../components/empty-report';
import ReportDialog from '../components/report-dialog';

export default function CreateReport() {
    const [open, setOpen] = useState<boolean>(false);
    const { program, reports } = usePage<{
        program: Program;
        reports: Report[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Back link={ViewController.programs()} />

                    <h1 className="text-xl font-semibold">{program.name}</h1>
                    <ReportDialog
                        program={program}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>
                <h1>All Reports</h1>

                <Activity mode={reports.length === 0 ? 'visible' : 'hidden'}>
                    <EmptyReport setIsOpen={setOpen} />
                </Activity>

                <Activity mode={reports.length > 0 ? 'visible' : 'hidden'}>
                    <div className="grid grid-cols-3 gap-5">
                        {reports.map((report, index) => (
                            <Link
                                href={ViewController.reportSubmissions([
                                    program,
                                    report,
                                ])}
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
            </div>
        </AppLayout>
    );
}
