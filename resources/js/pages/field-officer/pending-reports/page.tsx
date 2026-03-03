import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Report } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CalendarClock,
    Clock3,
    FileSearch,
    FileText,
    FolderKanban,
    Search,
    TimerReset,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { breadcrumbs } from '../dashboard/page';
import StatCard from './components/stat-card';

type FilterKey = 'all' | 'overdue' | 'due_soon';

export default function PendingReportsPage() {
    const { pendingReports = [] } = usePage<{ pendingReports: Report[] }>()
        .props;
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<FilterKey>('all');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntil = (dateLike: string | Date) => {
        const d = new Date(dateLike);
        d.setHours(0, 0, 0, 0);
        return Math.ceil(
            (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
    };

    const formatDate = (dateLike: string | Date) =>
        new Date(dateLike).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const stats = useMemo(() => {
        const overdue = pendingReports.filter(
            (r) => daysUntil(r.deadline) < 0,
        ).length;
        const dueSoon = pendingReports.filter((r) => {
            const d = daysUntil(r.deadline);
            return d >= 0 && d <= 7;
        }).length;

        return {
            total: pendingReports.length,
            overdue,
            dueSoon,
        };
    }, [pendingReports]);

    const filteredReports = useMemo(() => {
        const q = query.trim().toLowerCase();

        return pendingReports
            .filter((r) => {
                const byText =
                    !q ||
                    r.title.toLowerCase().includes(q) ||
                    r.program?.name?.toLowerCase().includes(q);

                if (!byText) return false;

                const days = daysUntil(r.deadline);

                if (filter === 'overdue') return days < 0;
                if (filter === 'due_soon') return days >= 0 && days <= 7;

                return true;
            })
            .sort(
                (a, b) =>
                    new Date(a.deadline).getTime() -
                    new Date(b.deadline).getTime(),
            );
    }, [pendingReports, query, filter]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Reports" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="gap-4 py-5">
                    <CardHeader className="px-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Pending Reports
                                </CardTitle>
                                <CardDescription>
                                    Track and submit reports before deadline.
                                </CardDescription>
                            </div>
                            <Link
                                href={ViewController.programs().url}
                                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                            >
                                <FolderKanban className="h-4 w-4" />
                                View Programs
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 px-5">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <StatCard
                                label="Total Pending"
                                value={stats.total}
                                icon={<FileText className="h-4 w-4" />}
                            />
                            <StatCard
                                label="Overdue"
                                value={stats.overdue}
                                icon={
                                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                                }
                            />
                            <StatCard
                                label="Due in 7 Days"
                                value={stats.dueSoon}
                                icon={
                                    <Clock3 className="h-4 w-4 text-amber-500" />
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <div className="relative w-full md:max-w-sm">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search title or program..."
                                    className="w-full rounded-md border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    {
                                        key: 'all',
                                        label: 'All',
                                        icon: FileText,
                                    },
                                    {
                                        key: 'overdue',
                                        label: 'Overdue',
                                        icon: AlertTriangle,
                                    },
                                    {
                                        key: 'due_soon',
                                        label: 'Due Soon',
                                        icon: Clock3,
                                    },
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() =>
                                            setFilter(item.key as FilterKey)
                                        }
                                        className={`rounded-md border px-3 py-1.5 text-sm ${
                                            filter === item.key
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'hover:bg-accent'
                                        }`}
                                    >
                                        <item.icon className="mr-1 inline h-3.5 w-3.5" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-3">
                    {filteredReports.length === 0 ? (
                        <Card className="py-8 text-center">
                            <CardContent>
                                <p className="inline-flex items-center gap-2 font-medium">
                                    <FileSearch className="h-4 w-4 text-muted-foreground" />
                                    No pending reports found.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Try another search or filter.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredReports.map((report) => {
                            const days = daysUntil(report.deadline);
                            const urgencyClass =
                                days < 0
                                    ? 'bg-rose-500/10 text-rose-600'
                                    : days <= 3
                                      ? 'bg-amber-500/10 text-amber-600'
                                      : 'bg-emerald-500/10 text-emerald-600';

                            return (
                                <Card key={report.id} className="gap-4 py-4">
                                    <CardContent className="px-4">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-base font-semibold">
                                                    {report.title}
                                                </h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {report.program?.name}
                                                </p>
                                            </div>
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${urgencyClass}`}
                                            >
                                                {days < 0
                                                    ? `${Math.abs(days)} day(s) overdue`
                                                    : `${days} day(s) left`}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarClock className="h-3.5 w-3.5" />
                                                Deadline:{' '}
                                                {formatDate(report.deadline)}
                                            </span>
                                            {report.final_deadline && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <TimerReset className="h-3.5 w-3.5" />
                                                    Final:{' '}
                                                    {formatDate(
                                                        report.final_deadline,
                                                    )}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5" />
                                                Templates:{' '}
                                                {report.templates?.length ?? 0}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5" />
                                                References:{' '}
                                                {report.references?.length ?? 0}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <Link
                                                href={ViewController.reportSubmissions.url(
                                                    {
                                                        program:
                                                            report.program.id,
                                                        report: report.id,
                                                    },
                                                )}
                                                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                                Open Submission
                                            </Link>
                                            <Link
                                                href={ViewController.reports.url(
                                                    {
                                                        program:
                                                            report.program.id,
                                                    },
                                                )}
                                                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
                                            >
                                                <FolderKanban className="h-4 w-4" />
                                                View Program Reports
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
