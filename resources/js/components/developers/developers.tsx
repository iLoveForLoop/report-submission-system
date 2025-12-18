import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CodeXml, GraduationCap, Users } from 'lucide-react';
import { Button } from '../ui/button';

// Import data and types
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
                    <CodeXml size={16} />
                    <span>Developers</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="scrollbar-hide border-border bg-card sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold text-foreground">
                        Development Team
                    </DialogTitle>
                </DialogHeader>

                <div className="py-3">
                    {/* Tree Structure Visualization */}
                    <div className="mb-4">
                        {/* Adviser Section - Centered */}
                        <div className="mb-4 flex flex-col items-center">
                            <div className="flex w-full max-w-sm flex-col items-center gap-1.5 rounded-lg border border-primary/10 bg-gradient-to-b from-primary/3 to-transparent p-3">
                                <div className="relative">
                                    <div className="h-16 w-16 overflow-hidden rounded-full border-3 border-primary/15 bg-gradient-to-br from-amber-50 to-amber-100 shadow-md">
                                        {adviserData.image && (
                                            <img
                                                src={adviserData.image}
                                                alt={adviserData.name}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-card bg-primary">
                                        <GraduationCap className="h-2.5 w-2.5 text-white" />
                                    </div>
                                </div>

                                {/* Centered Adviser Info */}
                                <div className="text-center">
                                    <div className="mb-1 flex flex-col items-center gap-1">
                                        <p className="text-base font-bold text-foreground">
                                            {adviserData.name}
                                        </p>
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                            {adviserData.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {adviserData.email}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-primary">
                                        {adviserData.department}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tree branches to developers */}
                        <div className="relative mb-4 flex justify-center">
                            <div className="absolute top-0 h-1 w-40 bg-gradient-to-r from-transparent via-primary/15 to-transparent"></div>
                            <div className="relative">
                                <div className="absolute top-0 right-0 left-0 flex justify-between px-12">
                                    <div className="h-6 w-px translate-x-10 -translate-y-2 transform bg-amber-700/20"></div>
                                    <div className="h-6 w-px -translate-x-10 -translate-y-2 transform bg-amber-700/20"></div>
                                </div>
                            </div>
                        </div>

                        {/* Developers Section */}
                        <div className="mb-3">
                            <div className="mb-3 flex items-center justify-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <h3 className="text-sm font-semibold text-foreground">
                                    Development Team
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {developersData.map((developer, index) => (
                                    <DeveloperCard
                                        key={index}
                                        developer={developer}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer with MDC Logo */}
                    <div className="border-t border-border pt-4">
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            {/* MDC Logo Section */}
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-1.5">
                                    <div className="flex h-full w-full items-center justify-center rounded">
                                        <img
                                            src={mdcLogo}
                                            alt="Mater Dei College Logo"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Mater Dei College
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        IT Department • BS Information
                                        Technology
                                    </p>
                                </div>
                            </div>

                            {/* Text Section */}
                            <div className="text-center sm:text-right">
                                <p className="text-xs text-muted-foreground">
                                    DILG Report Submission System
                                </p>
                                <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                                    Developed for Department of the Interior and
                                    Local Government
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
