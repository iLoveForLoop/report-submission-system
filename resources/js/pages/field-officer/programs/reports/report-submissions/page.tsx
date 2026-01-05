import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import Back from '@/components/back';
import AppLayout from '@/layouts/app-layout';
import { Program, Report, ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { EllipsisVertical, Folder } from 'lucide-react';
import { Activity, useState } from 'react';
import ReportSubmissionDialog from './components/report-submission-dialog';

export default function page() {
    const [open, setOpen] = useState<boolean>(false);

    const { program, report, reportSubmissions, hasSubmitted } = usePage<{
        program: Program;
        report: Report;
        reportSubmissions: ReportSubmission[];
        hasSubmitted: boolean;
    }>().props;

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Back link={ViewController.reports(program)} />

                    <h1 className="text-xl font-semibold">{report.title}</h1>
                    <ReportSubmissionDialog
                        open={open}
                        hasSubmitted={hasSubmitted}
                        setOpen={setOpen}
                        report={report}
                    />
                </div>

                <Activity
                    mode={reportSubmissions.length === 0 ? 'visible' : 'hidden'}
                >
                    No Submissions yet
                </Activity>

                <Activity
                    mode={reportSubmissions.length > 0 ? 'visible' : 'hidden'}
                >
                    <div className="grid grid-cols-3 gap-5">
                        {reportSubmissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="flex items-center gap-5 rounded-xl border bg-background/50 px-4 py-2"
                            >
                                <div>
                                    <Folder />
                                </div>
                                <div className="flex w-full items-center justify-between">
                                    <div>
                                        <h2 className="truncate text-lg font-semibold">
                                            {submission.field_officer?.name}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Deadline:{' '}
                                            {new Date(
                                                submission.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Activity>
            </div>
        </AppLayout>
    );
}
