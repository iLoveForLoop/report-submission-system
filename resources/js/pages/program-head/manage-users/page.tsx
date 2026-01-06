import { manageUsers } from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { FlashToaster } from '@/components/flash-toaster';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';
import Header from './components/header';
import UsersTable from './components/users-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: manageUsers().url,
    },
];

export default function ManageUsers() {
    const { users } = usePage<{ users: LaravelPaginator<User> }>().props;
    const usersData = users.data;
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

    console.log({ selectedUsers });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <FlashToaster />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">User Management</h1>
                <Header selectedUsers={selectedUsers} />

                <div>
                    <UsersTable
                        users={usersData}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                    />

                    <div className="flex items-center justify-center space-x-3 border-t py-4">
                        {/* First Page */}
                        {users.first_page_url && (
                            <Link href={users.first_page_url}>
                                <Button variant="outline" size="sm">
                                    <ChevronsLeft size={16} />
                                </Button>
                            </Link>
                        )}

                        {/* Previous Page */}
                        {users.prev_page_url ? (
                            <Link href={users.prev_page_url}>
                                <Button variant="outline" size="sm">
                                    <ChevronLeft size={16} />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                <ChevronLeft size={16} />
                            </Button>
                        )}

                        {/* Current Page */}
                        <span className="px-2">{users.current_page}</span>

                        {/* Next Page */}
                        {users.next_page_url ? (
                            <Link href={users.next_page_url}>
                                <Button variant="outline" size="sm">
                                    <ChevronRight size={16} />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                <ChevronRight size={16} />
                            </Button>
                        )}

                        {/* Last Page */}
                        {users.last_page_url && (
                            <Link href={users.last_page_url}>
                                <Button variant="outline" size="sm">
                                    <ChevronsRight size={16} />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
