/* eslint-disable @typescript-eslint/no-unused-vars */
// program-head/dashboard/page.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Activity,
    ArrowDown,
    ArrowUp,
    Award,
    Briefcase,
    Calendar,
    CheckCircle,
    CheckCircle2,
    ClipboardList,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    GraduationCap,
    HeartPulse,
    Hourglass,
    MapPin,
    PieChart,
    TrendingUp,
    Users,
    Utensils,
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
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Line,
    Pie,
    LineChart as ReLineChart,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/program-head/dashboard',
    },
];

// Enhanced static data for clusters
const clusterComparisonData = [
    {
        cluster: 'North Cluster',
        approved: 180,
        pending: 45,
        rejected: 20,
        total: 245,
        shortName: 'North',
    },
    {
        cluster: 'South Cluster',
        approved: 210,
        pending: 72,
        rejected: 30,
        total: 312,
        shortName: 'South',
    },
];

const recentSubmissions = [
    {
        id: 1,
        officer: 'John Santos',
        cluster: 'North Cluster',
        program: 'Food Distribution',
        status: 'approved',
        time: '2 hours ago',
        avatar: 'JS',
    },
    {
        id: 2,
        officer: 'Maria Cruz',
        cluster: 'South Cluster',
        program: 'Medical Mission',
        status: 'pending',
        time: '3 hours ago',
        avatar: 'MC',
    },
    {
        id: 3,
        officer: 'Pedro Reyes',
        cluster: 'North Cluster',
        program: 'Education Support',
        status: 'approved',
        time: '5 hours ago',
        avatar: 'PR',
    },
    {
        id: 4,
        officer: 'Anna Lopez',
        cluster: 'South Cluster',
        program: 'Livelihood Program',
        status: 'rejected',
        time: '6 hours ago',
        avatar: 'AL',
    },
    {
        id: 5,
        officer: 'Jose Villanueva',
        cluster: 'North Cluster',
        program: 'Health Services',
        status: 'pending',
        time: '8 hours ago',
        avatar: 'JV',
    },
];

const programStats = [
    {
        name: 'Food Distribution',
        submissions: 156,
        completion: 82,
        trend: '+12%',
        icon: Utensils,
    },
    {
        name: 'Medical Mission',
        submissions: 143,
        completion: 74,
        trend: '+8%',
        icon: HeartPulse,
    },
    {
        name: 'Education Support',
        submissions: 98,
        completion: 91,
        trend: '+15%',
        icon: GraduationCap,
    },
    {
        name: 'Livelihood Program',
        submissions: 87,
        completion: 68,
        trend: '-3%',
        icon: Briefcase,
    },
];

// Chart configurations
const approvedChartConfig = {
    approved: {
        label: 'Approved',
        color: 'hsl(142.1 76.2% 36.3%)',
    },
} satisfies ChartConfig;

const pendingChartConfig = {
    pending: {
        label: 'Pending',
        color: 'hsl(32.1 94.6% 43.7%)',
    },
} satisfies ChartConfig;

const rejectedChartConfig = {
    rejected: {
        label: 'Rejected',
        color: 'hsl(0 72.2% 50.6%)',
    },
} satisfies ChartConfig;



export default function Dashboard() {
    const getStatusBadge = (status: string) => {
        const styles = {
            approved:
                'bg-chart-2/20 text-chart-2 border-chart-2/30 dark:bg-chart-2/30 dark:text-chart-2 dark:border-chart-2/40',
            pending:
                'bg-chart-3/20 text-chart-3 border-chart-3/30 dark:bg-chart-3/30 dark:text-chart-3 dark:border-chart-3/40',
            rejected:
                'bg-chart-1/20 text-chart-1 border-chart-1/30 dark:bg-chart-1/30 dark:text-chart-1 dark:border-chart-1/40',
        };

        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}
            >
                {status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                {status === 'pending' && <Hourglass className="h-3 w-3" />}
                {status === 'rejected' && <XCircle className="h-3 w-3" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Program Head" />

            <div className="min-h-screen flex-1 space-y-6 bg-background p-4 md:p-8">
                {/* Header */}
                <div className="landing-page relative overflow-hidden rounded-xl border border-border bg-card p-8">
                    <div className="relative z-10">
                        <div className="grid grid-rows-1 lg:grid-cols-2">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                                    Provicial Director Dashboard
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Welcome back! Here's your program overview
                                </p>
                            </div>
                            <div className="flex items-center lg:justify-end gap-3 mt-3 lg:mt-0 ">
                                <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Last 30 days</span>
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90">
                                    <Download className="h-4 w-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Submissions
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">557</div>
                            {/* <div className="flex items-center text-xs text-muted-foreground">
                                <span className="mr-1 flex items-center text-chart-2">
                                    <ArrowUp className="h-3 w-3" />
                                    12.5%
                                </span>
                                vs last month
                            </div> */}
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
                            <div className="text-2xl font-bold">27</div>
                            {/* <div className="flex items-center text-xs text-muted-foreground">
                                <span className="mr-1 flex items-center text-chart-2">
                                    <ArrowUp className="h-3 w-3" />
                                    8.2%
                                </span>
                                across 2 clusters
                            </div> */}
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
                            <div className="text-2xl font-bold">390</div>
                            {/* <p className="text-xs text-muted-foreground">
                                70% success rate
                            </p> */}
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
                            <div className="text-2xl font-bold">117</div>
                            {/* <div className="flex items-center text-xs text-muted-foreground">
                                <span className="mr-1 flex items-center text-chart-1">
                                    <ArrowDown className="h-3 w-3" />
                                    5.1%
                                </span>
                                from last month
                            </div> */}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Chart Section - Three Vertical Bar Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Approved Chart */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-chart-2" />
                                <CardTitle>Approved Submissions</CardTitle>
                            </div>
                            <CardDescription>By cluster</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={approvedChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={clusterComparisonData}
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
                                    390
                                </span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Pending Chart */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Hourglass className="h-5 w-5 text-chart-3" />
                                <CardTitle>Pending Submissions</CardTitle>
                            </div>
                            <CardDescription>By cluster</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={pendingChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={clusterComparisonData}
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
                                    117
                                </span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Rejected Chart */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-chart-1" />
                                <CardTitle>Rejected Submissions</CardTitle>
                            </div>
                            <CardDescription>By cluster</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={rejectedChartConfig}
                                className="h-[250px] w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={clusterComparisonData}
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
                                    Total rejected
                                </span>
                                <span className="font-bold text-chart-1">
                                    50
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Second Row - Monthly Trends and Status Distribution */}


                {/* Program Performance Cards */}
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {programStats.map((program, index) => {
                                const Icon = program.icon;
                                return (
                                    <div
                                        key={program.name}
                                        className="rounded-lg bg-accent/50 p-4 transition-colors hover:bg-accent"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <span
                                                className={`flex items-center gap-1 text-sm ${
                                                    program.trend.startsWith(
                                                        '+',
                                                    )
                                                        ? 'text-chart-2'
                                                        : 'text-chart-1'
                                                }`}
                                            >
                                                {program.trend.startsWith(
                                                    '+',
                                                ) ? (
                                                    <ArrowUp className="h-3 w-3" />
                                                ) : (
                                                    <ArrowDown className="h-3 w-3" />
                                                )}
                                                {program.trend}
                                            </span>
                                        </div>
                                        <h3 className="mb-1 font-medium text-foreground">
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
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Submissions Table */}
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
                            <button className="flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm transition-colors hover:bg-accent/80">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] md:min-w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Officer
                                        </th>
                                        <th className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Cluster
                                        </th>
                                        <th className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Program
                                        </th>
                                        <th className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Status
                                        </th>
                                        <th className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Time
                                        </th>
                                        <th className="py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentSubmissions.map((submission) => (
                                        <tr
                                            key={submission.id}
                                            className="transition-colors hover:bg-accent/30"
                                        >
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                        {submission.avatar}
                                                    </div>
                                                    <span className="text-xs lg:text-sm font-medium text-foreground whitespace-nowrap">
                                                        {submission.officer}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="text-xs lg:text-sm flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                                    {submission.cluster}
                                                </div>
                                            </td>
                                            <td className="text-xs lg:text-sm py-3 text-muted-foreground whitespace-nowrap">
                                                {submission.program}
                                            </td>
                                            <td className="py-3 text-xs lg:text-sm whitespace-nowrap">
                                                {getStatusBadge(submission.status)}
                                            </td>
                                            <td className="py-3 text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
                                                {submission.time}
                                            </td>
                                            <td className="py-3">
                                                <button className="text-primary hover:text-primary/80">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
