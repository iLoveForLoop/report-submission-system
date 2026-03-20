import { manageUsers } from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, User } from '@/types';
import { usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import Header from './components/header';
import UsersTable from './components/users-table';

interface Filters {
    search?: string;
    role?: string;
    cluster?: string;
    department?: string;
    position?: string;
}

interface PageProps {
    users: LaravelPaginator<User>;
    departments: string[];
    positions: string[];
    filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: manageUsers().url },
];

export default function ManageUsers() {
    const { users, departments, positions, filters } =
        usePage<PageProps>().props;

    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    // Clear selection whenever the page data changes (new filter/page)
    // so stale IDs from previous pages don't linger in the set.
    const usersData = users.data;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ── Page title ────────────────────────────────────────────── */}
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h1 className="text-xl font-semibold">User Management</h1>
                </div>

                {/* ── Header with search + filters ──────────────────────────── */}
                <Header
                    selectedUsers={selectedUsers}
                    filters={filters}
                    departments={departments}
                    positions={positions}
                    manageUsersUrl={manageUsers().url}
                />

                {/* ── Result count ──────────────────────────────────────────── */}
                <p className="text-xs text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium text-foreground">
                        {users.from}
                    </span>
                    –
                    <span className="font-medium text-foreground">
                        {users.to}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-foreground">
                        {users.total}
                    </span>{' '}
                    users
                </p>

                {/* ── Table + pagination ────────────────────────────────────── */}
                {usersData.length === 0 ? (
                    <div className="flex h-[45vh] flex-col items-center justify-center gap-3 text-center">
                        <Users className="h-10 w-10 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No users match the current filters
                        </p>
                    </div>
                ) : (
                    <div>
                        <UsersTable
                            users={usersData}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                        />
                        <Pagination
                            paginator={users}
                            filters={Object.fromEntries(
                                Object.entries(filters).filter(([, v]) => !!v),
                            )}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
