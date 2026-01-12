import AppLayout from '@/layouts/app-layout';

import { WhenVisible } from '@inertiajs/react';
import { breadcrumbs } from '../dashboard/page';
import Submissions from './submissions';

export default function MyReports() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <WhenVisible
                data={'mySubmissions'}
                fallback={() => <div>Loading...</div>}
            >
                <Submissions />
            </WhenVisible>
        </AppLayout>
    );
}
