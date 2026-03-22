// notifications/page.tsx
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { useNotifications } from '@/hooks/use-notifications';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    CheckCheck,
    Clock3,
    ExternalLink,
    Filter,
    Loader2,
    Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Notifications', href: '#' },
];

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read_at: string | null;
    action_url: string | null;
}

interface NotificationPaginator {
    data: NotificationItem[];
    next_page_url: string | null;
    total: number;
}

type NotificationFilter = 'all' | 'unread' | 'read';

// Mock data generator
const generateMockNotifications = (): NotificationItem[] => {
    const now = new Date();
    const mockData: NotificationItem[] = [
        {
            id: '1',
            title: 'Report Approved',
            message: 'Your Q1 2024 Progress Report has been approved by the Program Manager.',
            created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            read_at: null,
            action_url: '/reports/1',
        },
        {
            id: '2',
            title: 'Submission Deadline Reminder',
            message: 'The submission deadline for the Field Activity Report is approaching in 3 days.',
            created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            read_at: null,
            action_url: '/reports/2',
        },
        {
            id: '3',
            title: 'Report Rejected',
            message: 'Your Monthly Financial Report was rejected due to incomplete documentation. Please review and resubmit.',
            created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            read_at: null,
            action_url: '/reports/3',
        },
        {
            id: '4',
            title: 'New Template Available',
            message: 'A new report template "Community Impact Assessment" has been added to your program.',
            created_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
            read_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // read 2 days ago
            action_url: '/templates',
        },
        {
            id: '5',
            title: 'Submission Successful',
            message: 'Your Quarterly Report has been successfully submitted and is pending review.',
            created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            read_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // read 3 days ago
            action_url: '/submissions/5',
        },
        {
            id: '6',
            title: 'Program Update',
            message: 'The "Youth Empowerment Program" has been extended until December 2024.',
            created_at: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
            read_at: null,
            action_url: '/programs/6',
        },
        {
            id: '7',
            title: 'Approval Pending',
            message: 'Your recent submission is awaiting approval from the Regional Coordinator.',
            created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            read_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // read 4 days ago
            action_url: '/submissions/7',
        },
        {
            id: '8',
            title: 'Feedback Received',
            message: 'You have received feedback on your Beneficiary Assessment Report.',
            created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
            read_at: null,
            action_url: '/feedback/8',
        },
        {
            id: '9',
            title: 'System Maintenance',
            message: 'Scheduled system maintenance on March 25, 2024 from 2:00 AM to 4:00 AM.',
            created_at: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
            read_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // read 8 days ago
            action_url: null,
        },
        {
            id: '10',
            title: 'Report Approved with Comments',
            message: 'Your Infrastructure Progress Report was approved with minor suggestions. Please review the comments.',
            created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            read_at: null,
            action_url: '/reports/10',
        },
    ];

    return mockData;
};

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function getNotificationTheme(title: string) {
    const t = title.toLowerCase();
    if (t.includes('approved') || t.includes('success')) {
        return {
            unreadBorder: 'border-green-500 bg-green-50 dark:border-green-800',
            unreadBg: 'bg-green-50 dark:bg-green-950/30',
            badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            markReadBtn:
                'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/50',
            viewBtn:
                'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600',
        };
    }
    if (t.includes('rejected') || t.includes('denied')) {
        return {
            unreadBorder: 'border-red-500 bg-red-50 dark:border-red-800',
            unreadBg: 'bg-red-50 dark:bg-red-950/30',
            badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
            markReadBtn:
                'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50',
            viewBtn:
                'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
        };
    }
    // Default/warning/pending notifications
    return {
        unreadBorder: 'border-amber-500 bg-amber-50 dark:border-amber-800',
        unreadBg: 'bg-amber-50 dark:bg-amber-950/30',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
        markReadBtn:
            'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/50',
        viewBtn:
            'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
    };
}

export default function NotificationsPage() {
    // Create mock data with pagination simulation
    const [mockNotifications] = useState<NotificationItem[]>(() =>
        generateMockNotifications()
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const itemsPerPage = 5;

    // Simulate paginated data
    const paginatedData = useMemo(() => {
        const start = 0;
        const end = currentPage * itemsPerPage;
        const data = mockNotifications.slice(start, end);
        const hasMore = end < mockNotifications.length;

        return {
            data,
            next_page_url: hasMore ? `/notifications?page=${currentPage + 1}` : null,
            total: mockNotifications.length,
        };
    }, [mockNotifications, currentPage]);

    const notificationList = paginatedData.data;
    const nextPageUrl = paginatedData.next_page_url;

    const { markAsRead, markAllAsRead, remove } = useNotifications();
    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [localReadMap, setLocalReadMap] = useState<Record<string, boolean>>(
        {},
    );
    const [loading, setLoading] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const loadMore = useCallback(() => {
        if (!nextPageUrl || loading || isLoadingMore) return;
        setLoading(true);
        setIsLoadingMore(true);

        // Simulate API call delay
        setTimeout(() => {
            setCurrentPage(prev => prev + 1);
            setLoading(false);
            setIsLoadingMore(false);
        }, 500);
    }, [nextPageUrl, loading, isLoadingMore]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading && !isLoadingMore) {
                    loadMore();
                }
            },
            { rootMargin: '200px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore, loading, isLoadingMore]);

    const normalized = useMemo(
        () =>
            notificationList.map((item) => ({
                ...item,
                isRead: item.read_at !== null || localReadMap[item.id] === true,
            })),
        [notificationList, localReadMap],
    );

    const filtered = useMemo(() => {
        if (filter === 'unread') return normalized.filter((n) => !n.isRead);
        if (filter === 'read') return normalized.filter((n) => n.isRead);
        return normalized;
    }, [filter, normalized]);

    const unreadCount = normalized.filter((n) => !n.isRead).length;
    const readCount = normalized.length - unreadCount;

    const markNotificationAsRead = (id: string) => {
        markAsRead(id);
        setLocalReadMap((prev) => ({ ...prev, [id]: true }));
    };

    const markAllNotificationsAsRead = () => {
        markAllAsRead();
        const next: Record<string, boolean> = {};
        normalized.forEach((n) => (next[n.id] = true));
        setLocalReadMap(next);
    };

    const handleCardClick = (item: NotificationItem & { isRead: boolean }) => {
        if (!item.isRead) markNotificationAsRead(item.id);
        if (item.action_url) router.visit(item.action_url);
    };

    const handleViewClick = (
        e: React.MouseEvent,
        item: NotificationItem & { isRead: boolean },
    ) => {
        e.stopPropagation();
        if (!item.isRead) markNotificationAsRead(item.id);
        if (item.action_url) router.visit(item.action_url);
    };

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        markNotificationAsRead(id);
    };

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        remove(id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="flex gap-2 items-center text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                            <BellRing className="h-5 w-5 text-primary dark:text-primary-400" />
                            Notifications
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Stay updated with submission activity and report
                            status changes.
                        </p>
                    </div>
                    <button
                        onClick={markAllNotificationsAsRead}
                        disabled={unreadCount === 0}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all as read
                    </button>
                </div>
                {/* Header Card */}
                <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                    {/* Stats - Updated colors to match filter buttons */}
                    <div className="grid gap-3 sm:grid-cols-3">

                        <div className="rounded-lg border border-border bg-muted dark:bg-muted/20 px-4 py-3">
                            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {paginatedData.total}
                            </p>
                        </div>
                        <div className="rounded-lg border border-amber-500 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-amber-600 uppercase">
                                Unread
                            </p>
                            <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-white">
                                {unreadCount}
                            </p>
                        </div>
                        <div className="rounded-lg border border-green-500 bg-green-50 dark:bg-green-950/20 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-green-600 uppercase">
                                Read
                            </p>
                            <p className="mt-1 text-lg font-semibold text-green-600 dark:text-white">
                                {readCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* List Card */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    {/* Filter row */}
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                            Filter
                        </p>
                        <div className="ml-2 flex flex-wrap gap-2">
                            {(['all', 'unread', 'read'] as const).map(
                                (value) => (
                                    <button
                                        key={value}
                                        onClick={() => setFilter(value)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide capitalize transition-colors ${
                                            filter === value
                                                ? value === 'unread'
                                                    ? 'bg-amber-500 text-white'
                                                    : value === 'read'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Notification list */}
                    {filtered.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center">
                            <Bell className="mx-auto h-9 w-9 text-muted-foreground/30" />
                            <p className="mt-3 text-sm font-medium text-foreground">
                                No notifications found
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                New updates will appear here once available.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 h-[48vh] overflow-y-auto pr-3">
                            {filtered.map((item) => {
                                const theme = getNotificationTheme(item.title);
                                const isClickable = !!item.action_url;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() =>
                                            isClickable && handleCardClick(item)
                                        }
                                        className={`group rounded-lg border px-4 py-3 transition-all ${
                                            item.isRead
                                                ? 'border-border bg-card'
                                                : `${theme.unreadBorder} ${theme.unreadBg}`
                                        } ${
                                            isClickable
                                                ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
                                                : 'cursor-default'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1 w-full sm:w-auto">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {!item.isRead && (
                                                        <span className={`h-2 w-2 flex-shrink-0 rounded-full ${
                                                            item.title.toLowerCase().includes('approved')
                                                                ? 'bg-green-500'
                                                                : item.title.toLowerCase().includes('rejected')
                                                                    ? 'bg-red-500'
                                                                    : 'bg-amber-500'
                                                        }`} />
                                                    )}
                                                    <p className="text-sm font-semibold text-foreground break-words">
                                                        {item.title}
                                                    </p>
                                                    {!item.isRead && (
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${theme.badge}`}
                                                        >
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground break-words">
                                                    {item.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock3 className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">
                                                        {formatDateTime(item.created_at)}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => handleRemove(e, item.id)}
                                                    className="rounded p-1 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                                    title="Dismiss notification"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {!item.isRead && (
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={(e) => handleMarkAsRead(e, item.id)}
                                                    className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border bg-card px-2.5 py-1.5 text-xs font-medium transition-colors ${theme.markReadBtn}`}
                                                >
                                                    <CheckCheck className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Mark as read</span>
                                                </button>

                                                {item.action_url && (
                                                    <button
                                                        onClick={(e) => handleViewClick(e, item)}
                                                        className={`inline-flex cursor-pointer items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors ${theme.viewBtn}`}
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                                                        <span className="whitespace-nowrap">View Report</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {item.isRead && item.action_url && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
                                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                                    <span className="break-words">Click to view report</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Infinite scroll sentinel */}
                    <div
                        ref={sentinelRef}
                        className="mt-4 flex justify-center py-2"
                    >
                        {isLoadingMore && (
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading more…
                            </span>
                        )}
                        {!nextPageUrl &&
                            !isLoadingMore &&
                            notificationList.length > 0 && (
                                <p className="text-xs text-muted-foreground/50">
                                    You've seen all notifications
                                </p>
                            )}
                    </div>
                </div>

                <ScrollToTop threshold={300} />
            </div>
        </AppLayout>
    );
}
