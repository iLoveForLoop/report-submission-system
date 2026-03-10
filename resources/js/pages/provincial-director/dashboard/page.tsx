import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowUp,
    Award,
    Calendar,
    CheckCircle,
    CheckCircle2,
    ClipboardList,
    Clock,
    Download,
    Eye,
    FileText,
    Hourglass,
    MapPin,
    Users,
    XCircle,
} from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClusterData {
    cluster: string;
    shortName: string;
    total: number;
    approved: number;
    pending: number;
    rejected: number;
}

interface RecentSubmission {
    id: string;
    officer: string;
    avatar: string;
    cluster: string;
    program: string;
    status: 'approved' | 'pending' | 'returned';
    time: string;
}

interface TopProgram {
    name: string;
    submissions: number;
    completion: number;
}

interface DashboardProps {
    total_submissions: number;
    active_officers: number;
    approved_count: number;
    pending_count: number;
    cluster_chart_data: ClusterData[];
    recent_submissions: RecentSubmission[];
    top_programs: TopProgram[];
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/program-head/dashboard' },
];

// ─── Chart configs ────────────────────────────────────────────────────────────

const totalSubmissionChartConfig = {
    total: { label: 'Total Submissions', color: 'hsl(212.1 76.2% 36.3%)' },
} satisfies ChartConfig;

const approvedChartConfig = {
    approved: { label: 'Approved', color: 'hsl(142.1 76.2% 36.3%)' },
} satisfies ChartConfig;

const pendingChartConfig = {
    pending: { label: 'Pending', color: 'hsl(32.1 94.6% 43.7%)' },
} satisfies ChartConfig;

const returnedChartConfig = {
    rejected: { label: 'Returned', color: 'hsl(0 72.2% 50.6%)' },
} satisfies ChartConfig;

// ─── Month picker ─────────────────────────────────────────────────────────────
// Generates last 12 months as options

function buildMonthOptions(): { label: string; value: string }[] {
    const options: { label: string; value: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });
        options.push({ label, value });
    }
    return options;
}

const MONTH_OPTIONS = buildMonthOptions();

interface MonthFilterProps {
    value: string;
    onChange: (month: string) => void;
}

function MonthFilter({ value, onChange }: MonthFilterProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent focus:outline-none"
        >
            <option value="">All time</option>
            {MONTH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const {
        total_submissions,
        active_officers,
        approved_count,
        pending_count,
        cluster_chart_data,
        recent_submissions,
        top_programs,
    } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;

    // Single shared month filter — all charts update together
    const [selectedMonth, setSelectedMonth] = useState('');
    const [chartData, setChartData] =
        useState<ClusterData[]>(cluster_chart_data);
    const [loadingCharts, setLoadingCharts] = useState(false);

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        setLoadingCharts(true);

        router.get(
            window.location.pathname,
            { month: month || undefined },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['cluster_chart_data'],
                onSuccess: (page) => {
                    const incoming = (page.props as unknown as DashboardProps)
                        .cluster_chart_data;
                    setChartData(incoming);
                    setLoadingCharts(false);
                },
                onError: () => setLoadingCharts(false),
            },
        );
    };

    // ── Status badge ──────────────────────────────────────────────────────────
    const getStatusBadge = (status: string) => {
        const styles = {
            approved:
                'bg-chart-2/20 text-chart-2 border-chart-2/30 dark:bg-chart-2/30 dark:text-chart-2 dark:border-chart-2/40',
            pending:
                'bg-chart-3/20 text-chart-3 border-chart-3/30 dark:bg-chart-3/30 dark:text-chart-3 dark:border-chart-3/40',
            returned:
                'bg-chart-1/20 text-chart-1 border-chart-1/30 dark:bg-chart-1/30 dark:text-chart-1 dark:border-chart-1/40',
        };
        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles] ?? styles.pending}`}
            >
                {status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                {status === 'pending' && <Hourglass className="h-3 w-3" />}
                {status === 'returned' && <XCircle className="h-3 w-3" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const sumField = (field: keyof ClusterData): number =>
        chartData.reduce((acc, row) => acc + (row[field] as number), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program Head" />

            <div className="min-h-screen flex-1 space-y-6 bg-background p-4 md:p-8">
                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="landing-page relative overflow-hidden rounded-xl border border-border bg-card p-8">
                    <div className="relative z-10">
                        <div className="grid grid-rows-1 lg:grid-cols-2">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                                    Provincial Director Dashboard
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Welcome back! Here's your program overview
                                </p>
                            </div>
                            <div className="mt-3 flex items-center gap-3 lg:mt-0 lg:justify-end">
                                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <MonthFilter
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                    />
                                    {loadingCharts && (
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    )}
                                </div>
                                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
                                    <Download className="h-4 w-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Cards ───────────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Submissions
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {total_submissions}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Officers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {active_officers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                across 2 clusters
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Approved Reports
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {approved_count}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {total_submissions > 0
                                    ? `${Math.round((approved_count / total_submissions) * 100)}% success rate`
                                    : 'No submissions yet'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Review
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pending_count}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Charts ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Total Submissions */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-chart-2" />
                                <CardTitle>Total Submissions</CardTitle>
                            </div>
                            <CardDescription>
                                By cluster —{' '}
                                {selectedMonth
                                    ? MONTH_OPTIONS.find(
                                          (o) => o.value === selectedMonth,
                                      )?.label
                                    : 'All time'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={totalSubmissionChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        dataKey="shortName"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        className="fill-muted-foreground text-sm"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        className="fill-muted-foreground text-xs"
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="line" />
                                        }
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="var(--color-total)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    >
                                        <LabelList
                                            dataKey="total"
                                            position="top"
                                            offset={8}
                                            className="fill-foreground font-medium"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="border-t border-border pt-4">
                            <div className="flex w-full items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total
                                </span>
                                <span className="font-bold">
                                    {sumField('total')}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Pending */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Hourglass className="h-5 w-5 text-chart-3" />
                                <CardTitle>Pending Submissions</CardTitle>
                            </div>
                            <CardDescription>
                                By cluster —{' '}
                                {selectedMonth
                                    ? MONTH_OPTIONS.find(
                                          (o) => o.value === selectedMonth,
                                      )?.label
                                    : 'All time'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={pendingChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        dataKey="shortName"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        className="fill-muted-foreground text-sm"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        className="fill-muted-foreground text-xs"
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="line" />
                                        }
                                    />
                                    <Bar
                                        dataKey="pending"
                                        fill="var(--color-pending)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    >
                                        <LabelList
                                            dataKey="pending"
                                            position="top"
                                            offset={8}
                                            className="fill-foreground font-medium"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="border-t border-border pt-4">
                            <div className="flex w-full items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total pending
                                </span>
                                <span className="font-bold text-chart-3">
                                    {sumField('pending')}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Approved */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-chart-2" />
                                <CardTitle>Approved Submissions</CardTitle>
                            </div>
                            <CardDescription>
                                By cluster —{' '}
                                {selectedMonth
                                    ? MONTH_OPTIONS.find(
                                          (o) => o.value === selectedMonth,
                                      )?.label
                                    : 'All time'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={approvedChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        dataKey="shortName"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        className="fill-muted-foreground text-sm"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        className="fill-muted-foreground text-xs"
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="line" />
                                        }
                                    />
                                    <Bar
                                        dataKey="approved"
                                        fill="var(--color-approved)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    >
                                        <LabelList
                                            dataKey="approved"
                                            position="top"
                                            offset={8}
                                            className="fill-foreground font-medium"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="border-t border-border pt-4">
                            <div className="flex w-full items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total approved
                                </span>
                                <span className="font-bold text-chart-2">
                                    {sumField('approved')}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Returned */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-chart-1" />
                                <CardTitle>Returned Submissions</CardTitle>
                            </div>
                            <CardDescription>
                                By cluster —{' '}
                                {selectedMonth
                                    ? MONTH_OPTIONS.find(
                                          (o) => o.value === selectedMonth,
                                      )?.label
                                    : 'All time'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={returnedChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        dataKey="shortName"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        className="fill-muted-foreground text-sm"
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        className="fill-muted-foreground text-xs"
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent indicator="line" />
                                        }
                                    />
                                    <Bar
                                        dataKey="rejected"
                                        fill="var(--color-rejected)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    >
                                        <LabelList
                                            dataKey="rejected"
                                            position="top"
                                            offset={8}
                                            className="fill-foreground font-medium"
                                            fontSize={12}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="border-t border-border pt-4">
                            <div className="flex w-full items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Total returned
                                </span>
                                <span className="font-bold text-chart-1">
                                    {sumField('rejected')}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* ── Top Programs ──────────────────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Top Programs</CardTitle>
                        </div>
                        <CardDescription>
                            Programs by submission volume
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {top_programs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Award className="h-10 w-10 text-muted-foreground/30" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No programs yet
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {top_programs.map((program, index) => (
                                    <div
                                        key={program.name}
                                        className="rounded-lg bg-accent/50 p-4 transition-colors hover:bg-accent"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <h3 className="mb-1 line-clamp-1 font-medium text-foreground">
                                            {program.name}
                                        </h3>
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            {program.submissions} submissions
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Completion
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {program.completion}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-secondary">
                                                <div
                                                    className="h-1.5 rounded-full bg-primary"
                                                    style={{
                                                        width: `${program.completion}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Recent Submissions Table ──────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <CardTitle>Recent Submissions</CardTitle>
                                    <CardDescription>
                                        Latest activity from field officers
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recent_submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ClipboardList className="h-10 w-10 text-muted-foreground/30" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No submissions yet
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px] md:min-w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            {[
                                                'Officer',
                                                'Cluster',
                                                'Program',
                                                'Status',
                                                'Time',
                                                '',
                                            ].map((h) => (
                                                <th
                                                    key={h}
                                                    className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {recent_submissions.map(
                                            (submission) => (
                                                <tr
                                                    key={submission.id}
                                                    className="transition-colors hover:bg-accent/30"
                                                >
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                                {
                                                                    submission.avatar
                                                                }
                                                            </div>
                                                            <span className="text-xs font-medium whitespace-nowrap text-foreground lg:text-sm">
                                                                {
                                                                    submission.officer
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-1 text-xs whitespace-nowrap text-muted-foreground lg:text-sm">
                                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                                            {submission.cluster}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-xs whitespace-nowrap text-muted-foreground lg:text-sm">
                                                        {submission.program}
                                                    </td>
                                                    <td className="py-3 text-xs whitespace-nowrap lg:text-sm">
                                                        {getStatusBadge(
                                                            submission.status,
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-xs whitespace-nowrap text-muted-foreground lg:text-sm">
                                                        {submission.time}
                                                    </td>
                                                    <td className="py-3">
                                                        <button className="text-primary hover:text-primary/80">
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4">
                        <button className="mx-auto flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                            View All Submissions
                            <ArrowUp className="h-4 w-4 rotate-45" />
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
