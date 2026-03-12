import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CodeXml, GraduationCap, Users } from 'lucide-react';
import { Button } from '../ui/button';

import { adviserData, developersData, mdcLogo } from './data';
import DeveloperCard from './developer-card';

const Developers = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="developers"
                    className="absolute bottom-5 left-5 gap-2"
                    size="xs"
                >
                    <CodeXml />
                    <span className='text-[8px]'>DEVELOPERS</span>

                </Button>
            </DialogTrigger>

            <DialogContent className="scrollbar-hide border-slate-200 bg-white p-0 sm:max-w-2xl dark:border-slate-700 dark:bg-slate-900">
                {/* Header banner */}
                <div className="relative overflow-hidden rounded-t-lg border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-700 dark:bg-slate-800/60">
                    {/* Subtle grid pattern */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: `linear-gradient(rgba(100,100,100,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(100,100,100,0.08) 1px, transparent 1px)`,
                            backgroundSize: '24px 24px',
                        }}
                    />
                    <DialogHeader className="relative">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-slate-800 dark:bg-slate-100">
                                <CodeXml className="h-3.5 w-3.5 text-white dark:text-slate-900" />

                            </div>
                            <DialogTitle className="text-base font-black tracking-tight text-slate-800 dark:text-slate-100">
                                Development Team
                            </DialogTitle>
                        </div>
                        {/* <p className="mt-1 text-center font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                            DILG Report Submission System · Region VII
                        </p> */}
                    </DialogHeader>
                </div>

                <div className="px-6 py-5">
                    <div className="overflow-y-auto lg:overflow-y-visible">
                        {/* Adviser Card */}
                        <div className="mb-6">
                            <div className="mb-3 flex items-center gap-2">
                                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                                <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Project Adviser
                                </span>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            </div>

                            <div className="flex items-center gap-4 rounded-sm border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="h-14 w-14 overflow-hidden rounded-sm border border-slate-200 dark:border-slate-700">
                                        {adviserData.image ? (
                                            <img
                                                src={adviserData.image}
                                                alt={adviserData.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-lg font-bold text-slate-400 dark:bg-slate-700">
                                                {adviserData.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-sm bg-slate-800 dark:bg-slate-100">
                                        <GraduationCap className="h-2.5 w-2.5 text-white dark:text-slate-900" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        {adviserData.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {adviserData.email}
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                        <span className="rounded-sm border border-slate-300 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            {adviserData.role}
                                        </span>
                                        {/* <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                            {adviserData.department}
                                        </span> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Developers Section */}
                        <div className="mb-5">
                            <div className="mb-3 flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-slate-400" />
                                <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Developers
                                </span>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            </div>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {developersData.map((developer, index) => (
                                    <DeveloperCard
                                        key={index}
                                        developer={developer}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-sm border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                                    <img
                                        src={mdcLogo}
                                        alt="Mater Dei College Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Mater Dei College
                                    </p>
                                    <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                        IT Department · BS Information Technology
                                    </p>
                                </div>
                            </div>

                            <div className="text-center sm:text-right">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    DILG Report Submission System
                                </p>
                                <p className="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                                    Deptartment of the Interior and Local Government
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Developers;
