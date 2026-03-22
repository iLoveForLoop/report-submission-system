import { Program } from '@/types';
import { Calendar, FileText, FolderOpen, User } from 'lucide-react';

export default function ReviewProgram({
    program,
}: {
    program: Program | null | undefined;
}) {
    if (!program) {
        return (
            <div className="flex h-full items-center justify-center p-6">
                <div className="text-center">
                    <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Select a program to view details
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            {/* Header Section */}
            <div className="border-b bg-muted/30 p-6">
                <div className="mb-3 flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg leading-tight font-semibold capitalize">
                            {program.name}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Program #{program.id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div
                className="space-y-6 overflow-y-auto p-6"
                style={{ height: 'calc(100% - 140px)' }}
            >
                {/* Description */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Description</span>
                    </div>
                    <p className="pl-6 text-sm leading-relaxed break-words text-muted-foreground">
                        {program.description || 'No description provided'}
                    </p>
                </div>

                {/* Coordinator */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Coordinator</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {program.coordinator.avatar ? (
                                <img
                                    src={program.coordinator.avatar}
                                    alt={program.coordinator.name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                program.coordinator.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {program.coordinator.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {program.coordinator.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Timeline</span>
                    </div>
                    <div className="space-y-2 pl-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Created
                            </span>
                            <span className="font-medium">
                                {new Date(
                                    program.created_at,
                                ).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Updated
                            </span>
                            <span className="font-medium">
                                {new Date(
                                    program.updated_at,
                                ).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
