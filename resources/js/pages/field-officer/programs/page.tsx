import ViewController from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import AppLayout from '@/layouts/app-layout';
import { Program } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { EllipsisVertical, Folder } from 'lucide-react';
import { Activity } from 'react';

export default function page() {
    const { programs } = usePage<{ programs: Program[] }>().props;

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-center text-2xl font-semibold">
                    All Programs
                </h1>
                <Activity mode={programs.length <= 0 ? 'visible' : 'hidden'}>
                    <h1>No programs yet</h1>
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
                                            <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
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
