/* eslint-disable @typescript-eslint/no-unused-vars */
// program-head/dashboard/page.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Clock,
    Download,
    Eye,
    FileText,
    Hourglass,
    MapPin,
    RotateCcw,
    Users,
} from 'lucide-react';

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

function MonthFilter({
    value,
    onChange,
}: {
    value: string;
    onChange: (month: string) => void;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded border-2 border-border bg-card px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
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

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({
    status,
}: {
    status: 'approved' | 'pending' | 'returned';
}) {
    const configMap = {
        approved: {
            cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
            icon: CheckCircle2,
            label: 'Approved',
        },
        pending: {
            cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
            icon: Hourglass,
            label: 'Pending',
        },
        returned: {
            cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
            icon: RotateCcw,
            label: 'Returned',
        },
    };

    const config = configMap[status] ?? {
        cls: 'bg-muted text-muted-foreground',
        icon: Hourglass,
        label: status ?? 'Unknown',
    };

    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${config.cls}`}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
}

// ─── Shared Chart Card ────────────────────────────────────────────────────────

function ChartCard({
    title,
    icon: Icon,
    iconClass,
    description,
    totalLabel,
    totalValue,
    totalValueClass,
    children,
}: {
    title: string;
    icon: React.ElementType;
    iconClass: string;
    description: string;
    totalLabel: string;
    totalValue: number;
    totalValueClass: string;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded border-2 border-border bg-card">
            <div className="flex items-center gap-2.5 border-b-2 border-border bg-muted/40 px-5 py-3">
                <div className={`rounded p-1.5 ${iconClass}`}>
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        {title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>
            <div className="p-4">{children}</div>
            <div className="flex items-center justify-between border-t-2 border-border px-5 py-3">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                    {totalLabel}
                </span>
                <span className={`text-sm font-bold ${totalValueClass}`}>
                    {totalValue}
                </span>
            </div>
        </div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
    title,
    subtitle,
    icon: Icon,
    headerColor = 'bg-blue-500',
    action,
}: {
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    headerColor?: string;
    action?: React.ReactNode;
}) {
    return (
        <div
            className={`flex items-center justify-between border-b-2 border-border px-5 py-3 ${headerColor}`}
        >
            <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-white" />
                <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-white/70">{subtitle}</p>
                    )}
                </div>
            </div>
            {action}
        </div>
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

    const sumField = (field: keyof ClusterData): number =>
        chartData.reduce((acc, row) => acc + (row[field] as number), 0);

    const selectedMonthLabel =
        MONTH_OPTIONS.find((o) => o.value === selectedMonth)?.label ??
        'All time';

    const stats = [
        {
            title: 'Total Submissions',
            value: total_submissions,
            sub: 'All reports submitted',
            icon: FileText,
            accent: 'border-l-blue-500',
            valueColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Active Officers',
            value: active_officers,
            sub: 'Across clusters',
            icon: Users,
            accent: 'border-l-slate-500',
            valueColor: 'text-foreground',
        },
        {
            title: 'Approved Reports',
            value: approved_count,
            sub:
                total_submissions > 0
                    ? `${Math.round((approved_count / total_submissions) * 100)}% success rate`
                    : 'No submissions yet',
            icon: CheckCircle2,
            accent: 'border-l-green-500',
            valueColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Pending Review',
            value: pending_count,
            sub: 'Awaiting action',
            icon: Clock,
            accent: 'border-l-amber-500',
            valueColor: 'text-amber-600 dark:text-amber-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program Head Dashboard" />

            <div className="flex-1 space-y-6 bg-background p-6 md:p-8">
                {/* ── System Header (traffic lights) ───────────────────── */}
                <div className="border border-border bg-card">
                    <div className="flex items-center gap-3 border-b border-border/50 bg-muted/30 px-5 py-2">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-black/70" />
                        </div>
                    </div>

                    <div className="px-5 py-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    Program Head Dashboard
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Overview of submissions, officers, and
                                    program performance
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Month filter */}
                                <div className="flex items-center gap-2 bg-card px-3 py-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    <MonthFilter
                                        value={selectedMonth}
                                        onChange={handleMonthChange}
                                    />
                                    {loadingCharts && (
                                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    )}
                                </div>
                                <button className="flex items-center gap-1.5 rounded border-2 border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                                    <Download className="h-3.5 w-3.5" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className={`group flex items-center gap-4 rounded border-2 border-l-4 border-border bg-card p-4 ${stat.accent}`}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    {stat.title}
                                </p>
                                <p
                                    className={`mt-1 text-3xl leading-none font-bold ${stat.valueColor}`}
                                >
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {stat.sub}
                                </p>
                            </div>
                            <stat.icon className="h-8 w-8 shrink-0 text-muted-foreground/40" />
                        </div>
                    ))}
                </div>

                {/* ── Charts Grid ── */}
                <div className="grid gap-5 lg:grid-cols-2">
                    <ChartCard
                        title="Total Submissions"
                        icon={FileText}
                        iconClass="text-blue-600 dark:text-blue-400"
                        description={`By cluster · ${selectedMonthLabel}`}
                        totalLabel="Total"
                        totalValue={sumField('total')}
                        totalValueClass="text-blue-600 dark:text-blue-400"
                    >
                        <ChartContainer
                            config={totalSubmissionChartConfig}
                            className="h-[240px] w-full"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
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
                                    radius={[3, 3, 0, 0]}
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
                    </ChartCard>

                    <ChartCard
                        title="Pending Submissions"
                        icon={Hourglass}
                        iconClass="text-amber-600 dark:text-amber-400"
                        description={`By cluster · ${selectedMonthLabel}`}
                        totalLabel="Total pending"
                        totalValue={sumField('pending')}
                        totalValueClass="text-amber-600 dark:text-amber-400"
                    >
                        <ChartContainer
                            config={pendingChartConfig}
                            className="h-[240px] w-full"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
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
                                    radius={[3, 3, 0, 0]}
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
                    </ChartCard>

                    <ChartCard
                        title="Approved Submissions"
                        icon={CheckCircle2}
                        iconClass="text-green-600 dark:text-green-400"
                        description={`By cluster · ${selectedMonthLabel}`}
                        totalLabel="Total approved"
                        totalValue={sumField('approved')}
                        totalValueClass="text-green-600 dark:text-green-400"
                    >
                        <ChartContainer
                            config={approvedChartConfig}
                            className="h-[240px] w-full"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
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
                                    radius={[3, 3, 0, 0]}
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
                    </ChartCard>

                    <ChartCard
                        title="Returned Submissions"
                        icon={RotateCcw}
                        iconClass="text-red-600 dark:text-red-400"
                        description={`By cluster · ${selectedMonthLabel}`}
                        totalLabel="Total returned"
                        totalValue={sumField('rejected')}
                        totalValueClass="text-red-600 dark:text-red-400"
                    >
                        <ChartContainer
                            config={returnedChartConfig}
                            className="h-[240px] w-full"
                        >
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 0,
                                    bottom: 10,
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
                                    radius={[3, 3, 0, 0]}
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
                    </ChartCard>
                </div>

                {/* ── Top Programs ── */}
                <div className="overflow-hidden rounded border-2 border-border bg-card">
                    <SectionHeader
                        title="Top Programs"
                        // subtitle="By submission volume"
                        icon={Award}
                        headerColor="bg-blue-500"
                    />

                    <div className="p-5">
                        {top_programs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                <Award className="h-9 w-9 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">
                                    No programs yet.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {top_programs.map((program, index) => (
                                    <div
                                        key={program.name}
                                        className="rounded border-2 border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="rounded bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <h3 className="mb-0.5 line-clamp-1 text-sm font-semibold text-foreground">
                                            {program.name}
                                        </h3>
                                        <p className="mb-3 text-xs text-muted-foreground">
                                            {program.submissions} submissions
                                        </p>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Completion
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    {program.completion}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-sm bg-border">
                                                <div
                                                    className={`h-full rounded-sm transition-all ${
                                                        program.completion ===
                                                        100
                                                            ? 'bg-green-500'
                                                            : program.completion >=
                                                                50
                                                              ? 'bg-blue-500'
                                                              : 'bg-amber-500'
                                                    }`}
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
                    </div>
                </div>

                {/* ── Recent Submissions ── */}
                <div className="overflow-hidden rounded border-2 border-border bg-card">
                    <SectionHeader
                        title="Recent Submissions"
                        // subtitle="Latest activity from field officers"
                        icon={ClipboardList}
                        headerColor="bg-blue-500"
                        action={
                            <button className="flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white hover:underline">
                                View all
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        }
                    />

                    {recent_submissions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                            <ClipboardList className="h-9 w-9 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">
                                No submissions yet.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b-2 border-border bg-muted/40">
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
                                                className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_submissions.map((submission) => (
                                        <tr
                                            key={submission.id}
                                            className="border-b-2 border-border transition-colors last:border-b-0 hover:bg-muted/30"
                                        >
                                            {/* Officer */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                                                        {submission.avatar}
                                                    </div>
                                                    <span className="text-sm font-medium whitespace-nowrap text-foreground">
                                                        {submission.officer}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Cluster */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1 text-sm whitespace-nowrap text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                    {submission.cluster}
                                                </div>
                                            </td>

                                            {/* Program */}
                                            <td className="px-5 py-3.5 text-sm whitespace-nowrap text-muted-foreground">
                                                {submission.program}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-3.5">
                                                <StatusBadge
                                                    status={submission.status}
                                                />
                                            </td>

                                            {/* Time */}
                                            <td className="px-5 py-3.5 text-sm whitespace-nowrap text-muted-foreground">
                                                {submission.time}
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-3.5">
                                                <button className="cursor-pointer rounded border-2 border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-center border-t-2 border-border px-5 py-3">
                        <button className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                            View All Submissions
                            <ArrowUpRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
