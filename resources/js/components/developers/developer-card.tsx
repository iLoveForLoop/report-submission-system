// components/DeveloperCard.tsx
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, Building, Mail, User } from 'lucide-react';
import { Developer } from '../../components/types';

interface DeveloperCardProps {
    developer: Developer;
}

const DeveloperCard = ({ developer }: DeveloperCardProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="group flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card p-2 transition-all hover:border-primary/25 hover:bg-primary/5 hover:shadow-sm">
                    {/* Developer Avatar */}
                    <div className="relative">
                        <div className="h-10 w-10 overflow-hidden rounded-full border border-card bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm transition-transform group-hover:scale-105">
                            {developer.image ? (
                                <img
                                    src={developer.image}
                                    alt={developer.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border border-card bg-primary/10"></div>
                    </div>

                    {/* Developer Info */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-0.5">
                            <p className="text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                                {developer.name}
                            </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            {developer.email}
                        </p>
                    </div>
                </div>
            </DialogTrigger>

            {/* Developer Profile Modal */}
            <DialogContent className="scrollbar-hide border-border bg-card sm:max-w-md">
                <div className="py-3">
                    {/* Profile Header */}
                    <div className="mb-4 flex flex-col items-center">
                        <div className="relative mb-3">
                            <div className="h-24 w-24 overflow-hidden rounded-full border-3 border-primary/15 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
                                {developer.image ? (
                                    <img
                                        src={developer.image}
                                        alt={developer.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <User className="h-12 w-12 text-blue-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <h2 className="mb-1 text-lg font-bold text-foreground">
                            {developer.name}
                        </h2>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <p className="text-sm">{developer.email}</p>
                        </div>
                    </div>

                    {/* Bio Section */}
                    {developer.bio && (
                        <div className="mb-4">
                            <h3 className="mb-1.5 flex items-center gap-1.5 text-base font-semibold text-foreground">
                                <User className="h-4 w-4 text-primary" />
                                About
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {developer.bio}
                            </p>
                        </div>
                    )}

                    {/* Skills Section */}
                    {developer.skills && (
                        <div className="mb-4">
                            <h3 className="mb-2 flex items-center gap-1.5 text-base font-semibold text-foreground">
                                <Briefcase className="h-4 w-4 text-primary" />
                                Skills & Expertise
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {developer.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full border border-primary/10 bg-primary/5 px-2 py-1 text-xs text-primary"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Responsibilities Section */}
                    {developer.responsibilities && (
                        <div className="mb-4">
                            <h3 className="mb-2 flex items-center gap-1.5 text-base font-semibold text-foreground">
                                <Building className="h-4 w-4 text-primary" />
                                Project Responsibilities
                            </h3>
                            <ul className="space-y-1.5">
                                {developer.responsibilities.map(
                                    (responsibility, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-1.5"
                                        >
                                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                                            <span className="text-sm text-muted-foreground">
                                                {responsibility}
                                            </span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeveloperCard;
