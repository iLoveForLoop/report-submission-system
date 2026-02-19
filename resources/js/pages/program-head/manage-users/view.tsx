import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';

export default function ViewUser() {
    const user = usePage<{ user: User }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <div>Name: {user.user.name}</div>
            </div>
        </AppLayout>
    );
}
