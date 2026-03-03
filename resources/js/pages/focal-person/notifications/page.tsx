import { useNotifications } from '@/hooks/use-notifications';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { NotificationItem, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    CheckCheck,
    Clock3,
    ExternalLink,
    Filter,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Notifications', href: '#' },
];

type NotificationFilter = 'all' | 'unread' | 'read';

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

// Maps notification title keywords to a color theme
// Extend this as you add more notification types
function getNotificationTheme(title: string): {
    unreadBorder: string;
    unreadBg: string;
    badge: string;
    markReadBtn: string;
    viewBtn: string;
} {
    const t = title.toLowerCase();

    if (t.includes('approved') || t.includes('success')) {
        return {
            unreadBorder: 'border-emerald-200',
            unreadBg: 'bg-emerald-50',
            badge: 'bg-emerald-100 text-emerald-700',
            markReadBtn:
                'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
            viewBtn: 'bg-emerald-600 hover:bg-emerald-700',
        };
    }
    if (t.includes('rejected') || t.includes('denied')) {
        return {
            unreadBorder: 'border-red-200',
            unreadBg: 'bg-red-50',
            badge: 'bg-red-100 text-red-700',
            markReadBtn: 'border-red-200 text-red-600 hover:bg-red-50',
            viewBtn: 'bg-red-600 hover:bg-red-700',
        };
    }
    // default: indigo (submitted/pending/etc)
    return {
        unreadBorder: 'border-indigo-100',
        unreadBg: 'bg-indigo-50',
        badge: 'bg-indigo-100 text-indigo-700',
        markReadBtn: 'border-indigo-200 text-indigo-600 hover:bg-indigo-50',
        viewBtn: 'bg-indigo-600 hover:bg-indigo-700',
    };
}

export default function NotificationsPage() {
    const { notifications } = usePage<{
        notifications: { data: NotificationItem[] };
    }>().props;

    const notificationList = notifications?.data ?? [];
    const { markAsRead, markAllAsRead, remove, removeAll } = useNotifications();

    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [localReadMap, setLocalReadMap] = useState<Record<string, boolean>>(
        {},
    );

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

    // Click the card body → mark as read + navigate
    const handleCardClick = (item: NotificationItem & { isRead: boolean }) => {
        if (!item.isRead) {
            markNotificationAsRead(item.id);
        }
        if (item.action_url) {
            router.visit(item.action_url);
        }
    };

    // Click the "View" button → same behavior, but explicit
    const handleViewClick = (
        e: React.MouseEvent,
        item: NotificationItem & { isRead: boolean },
    ) => {
        e.stopPropagation(); // prevent card click from double-firing
        if (!item.isRead) {
            markNotificationAsRead(item.id);
        }
        if (item.action_url) {
            router.visit(item.action_url);
        }
    };

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // prevent card click
        markNotificationAsRead(id);
    };

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // prevent card click
        remove(id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header Card */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-semibold text-card-foreground">
                                <BellRing className="h-5 w-5 text-primary" />
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
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {normalized.length}
                            </p>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/30">
                            <p className="text-xs font-medium tracking-wide text-blue-600 dark:text-blue-400 uppercase">
                                Unread
                            </p>
                            <p className="mt-1 text-lg font-semibold text-blue-700 dark:text-blue-300">
                                {unreadCount}
                            </p>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                            <p className="text-xs font-medium tracking-wide text-emerald-600 dark:text-emerald-400 uppercase">
                                Read
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                                {readCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications List Card */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                            Filter
                        </p>
                        <div className="ml-2 flex flex-wrap gap-2">
                            {(['all', 'unread', 'read'] as const).map(
                                (value) => {
                                    const active = filter === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setFilter(value)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide capitalize transition-colors ${
                                                active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    {filtered.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center">
                            <Bell className="mx-auto h-9 w-9 text-muted-foreground" />
                            <p className="mt-3 text-sm font-medium text-foreground">
                                No notifications found
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                New updates will appear here once available.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-lg border px-4 py-3 transition-colors ${
                                        item.isRead
                                            ? 'border-border bg-card'
                                            : 'border-primary/20 bg-primary/5'
                                    }`}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {item.title}
                                                </p>
                                                {!item.isRead && (
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.message}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {formatDateTime(item.created_at)}
                                        </div>
                                    </div>

                                    {!item.isRead && (
                                        <div className="mt-3">
                                            <button
                                                onClick={() =>
                                                    markAsRead(item.id)
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-primary/20 bg-background px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                                            >
                                                Mark as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
