import { manageUsers } from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { FlashToaster } from '@/components/flash-toaster';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPaginator, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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

    console.log({ users });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <FlashToaster />
            <div className="flex h-full flex-1 flex-col gap-2 overflow-x-auto rounded-xl p-4">
                <h1 className="text-xl font-semibold">User Management</h1>
                <Header selectedUsers={selectedUsers} />

                <div>
                    <UsersTable
                        users={usersData}
                        selectedUsers={selectedUsers}
                        setSelectedUsers={setSelectedUsers}
                    />
                    <Pagination paginator={users} />
                </div>
            </div>
        </AppLayout>
    );
}
