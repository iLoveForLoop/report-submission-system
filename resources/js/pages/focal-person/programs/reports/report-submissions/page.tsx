import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import Back from '@/components/back';
import { Button } from '@/components/ui/button';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/focal-person/dashboard/page';
import { Program, Report, ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { Download, Grid2x2, List } from 'lucide-react';
import { Activity } from 'react';
import GridView from './components/grid-view';
import ListView from './components/list-view';

export default function page() {
    const { report, reportSubmissions, program } = usePage<{
        report: Report;
        reportSubmissions: ReportSubmission[];
        program: Program;
    }>().props;

    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    console.log({ reportSubmissions });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Back link={ViewController.reports(program)} />

                    <h1 className="text-xl font-semibold">{report.title}</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                                title="Grid view"
                            >
                                <Grid2x2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                                title="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <Button asChild variant="outline" size="sm">
                            <a
                                href={`/downloads/folder/${report.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Download />
                                Download All
                            </a>
                        </Button>
                    </div>
                </div>

                <Activity
                    mode={reportSubmissions.length === 0 ? 'visible' : 'hidden'}
                >
                    No Submissions yet
                </Activity>

                <Activity
                    mode={reportSubmissions.length > 0 ? 'visible' : 'hidden'}
                >
                    {viewMode === 'grid' ? (
                        <GridView reportSubmissions={reportSubmissions} />
                    ) : (
                        <ListView reportSubmissions={reportSubmissions} />
                    )}
                </Activity>
            </div>
        </AppLayout>
    );
}
