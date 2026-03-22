import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';
import { Program } from '@/types';
import { Deferred, Head, usePage } from '@inertiajs/react';
import { FolderOpen, Layers } from 'lucide-react';
import GridView from './components/grid-view';

export default function Page() {
    const { programs } = usePage<{ programs: Program[] }>().props;

    console.log({ programs });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />

            {/* Header Section */}
            <div className="border-b border-border  p-4">
                <div>
                    <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground lg:text-2xl dark:text-white">
                        <Layers className="dark:text-primary-400 h-5 w-5 text-primary" />
                        Programs
                    </h1>
                    <p className='mt-1 text-sm text-muted-foreground'>Manage and view all the programs </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
                <Deferred
                    data="programs"
                    fallback={() => (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">
                                    Loading programs...
                                </p>
                            </div>
                        </div>
                    )}
                >
                    {programs && programs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mb-1 text-lg font-medium text-foreground">
                                No programs yet
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Programs will appear here once they are created.
                            </p>
                        </div>
                    ) : (
                        programs && <GridView programs={programs} />
                    )}
                </Deferred>
            </div>
        </AppLayout>
    );
}
