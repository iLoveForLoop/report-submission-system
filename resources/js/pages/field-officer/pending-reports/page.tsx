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

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <CardTitle className="flex gap-2 items-center text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                            <FileText className="h-5 w-5 text-primary dark:text-primary-400" />
                            Pending Reports
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                            Track and submit reports before deadline.
                        </CardDescription>
                    </div>
                    <Link
                        href={ViewController.programs().url}
                        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                        <FolderKanban className="h-4 w-4" />
                        View Programs
                    </Link>
                </div>
                <Card className="gap-4 dark:border-gray-700">
                    <CardContent className="space-y-4 px-5">
                        <div className="flex flex-col justify-between md:flex-row md:items-center">
                            <div className="relative w-full md:max-w-sm">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-500" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search title or program..."
                                    className="w-full rounded-md border bg-background py-2 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-primary-400/30"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5 md:mt-0">
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
                                                ? 'border-primary bg-primary/10 text-primary dark:border-primary-400 dark:bg-primary-400/10 dark:text-primary-400'
                                                : 'hover:bg-accent dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                        }`}
                                    >
                                        <item.icon className="mr-1 inline h-3.5 w-3.5" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
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
                                    <AlertTriangle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                                }
                            />
                            <StatCard
                                label="Due in 7 Days"
                                value={stats.dueSoon}
                                icon={
                                    <Clock3 className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-3 h-[48vh] overflow-y-auto pr-3">
                    {filteredReports.length === 0 ? (
                        <Card className="py-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
                            <CardContent>
                                <p className="inline-flex items-center gap-2 font-medium dark:text-gray-300">
                                    <FileSearch className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                                    No pending reports found.
                                </p>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">
                                    Try another search or filter.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredReports.map((report) => {
                            const days = daysUntil(report.deadline);
                            const urgencyClass =
                                days < 0
                                    ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                                    : days <= 3
                                        ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                                        : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';

                            return (
                                <Card key={report.id} className={`gap-4 py-4 dark:border-gray-700 dark:bg-gray-800/50
                                    ${days < 0
                                        ? 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-500'
                                        : 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-500'
                                    }`}>
                                    <CardContent className="px-4 dark:text-gray-300">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-base font-semibold dark:text-white">
                                                    {report.title}
                                                </h2>
                                                <p className="text-sm text-muted-foreground dark:text-gray-400">
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

                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground dark:text-gray-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarClock className="h-3.5 w-3.5 dark:text-gray-500" />
                                                Deadline:{' '}
                                                {formatDate(report.deadline)}
                                            </span>
                                            {report.final_deadline && (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <TimerReset className="h-3.5 w-3.5 dark:text-gray-500" />
                                                    Final:{' '}
                                                    {formatDate(
                                                        report.final_deadline,
                                                    )}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5 dark:text-gray-500" />
                                                Templates:{' '}
                                                {report.templates?.length ?? 0}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5 dark:text-gray-500" />
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
                                                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
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
                                                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
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
