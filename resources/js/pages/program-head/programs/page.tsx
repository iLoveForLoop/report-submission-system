import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { FlashToaster } from '@/components/flash-toaster';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Program, User, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Folder } from 'lucide-react';
import { Activity, useState } from 'react';
import EllipsisVerticalCard from './components/ellipsis-vertival';
import EmptyProgram from './components/empty-programs';
import ProgramDialog from './components/program-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: dashboard().url,
    },
];

export default function Programs() {
    const [open, setOpen] = useState<boolean>(false);

    const { programs } = usePage<{ programs: Program[] }>().props;

    const { coordinators } = usePage<{
        coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />

            <FlashToaster />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <ProgramDialog
                        coordinators={coordinators}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>

                <Activity mode={programs.length === 0 ? 'visible' : 'hidden'}>
                    <EmptyProgram setIsOpen={setOpen} />
                </Activity>

                <Activity mode={programs.length > 0 ? 'visible' : 'hidden'}>
                    <div className="grid grid-cols-3 gap-5">
                        {programs.map((program, index) => (
                            <Link
                                key={index}
                                href={ViewController.reports(program)}
                            >
                                <div className="flex items-center gap-5 rounded-xl border bg-background/50 px-4 py-2">
                                    <div>
                                        <Folder />
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <div>
                                            <h2 className="truncate text-lg font-semibold">
                                                {program.name}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {program.description}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Coordinator:{' '}
                                                {program.coordinator.name}
                                            </p>
                                        </div>
                                        <div>
                                            <EllipsisVerticalCard
                                                program={program}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Activity>
            </div>
        </AppLayout>
    );
}
