import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';

export default function Submission() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>Submissions</div>
        </AppLayout>
    );
}
