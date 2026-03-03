/* eslint-disable @typescript-eslint/no-explicit-any */
// report-submission-dialog.tsx
import ReportSubmissionController from '@/actions/App/Http/Controllers/ReportSubmissionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Report } from '@/types';
import { Form } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    FileUp,
    Folder,
    UploadCloud,
} from 'lucide-react';
import { useState } from 'react';

interface DynamicFieldDefinition {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'textarea' | 'file';
    required: boolean;
}

interface ReportSubmissionDialogProps {
    open: boolean;
    hasSubmitted: boolean;
    setOpen: (open: boolean) => void;
    report: Report;
}

export default function ReportSubmissionDialog({
    open,
    hasSubmitted,
    setOpen,
    report,
}: ReportSubmissionDialogProps) {
    const schema = (report.form_schema || []) as DynamicFieldDefinition[];
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(
        {},
    );

    const handleFieldChange = (fieldId: string, files: FileList | null) => {
        if (files) {
            const fileArray = Array.from(files);
            setUploadedFiles((prev) => ({
                ...prev,
                [fieldId]: fileArray,
            }));
            setAnswers((prev) => ({
                ...prev,
                [fieldId]: fileArray,
            }));
        }
    };

    const clearFiles = (fieldId: string) => {
        setUploadedFiles((prev) => {
            const newState = { ...prev };
            delete newState[fieldId];
            return newState;
        });
        setAnswers((prev) => {
            const newState = { ...prev };
            delete newState[fieldId];
            return newState;
        });
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isDeadlinePassed =
        report.deadline && new Date(report.deadline) < new Date();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!hasSubmitted ? (
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="default"
                        className="shadow-sm"
                    >
                        <Folder className="mr-2 h-4 w-4" />
                        Submit Report
                    </Button>
                </DialogTrigger>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="cursor-not-allowed opacity-75"
                >
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Report Already Submitted
                </Button>
            )}

            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
                <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-xl text-foreground">
                                    Submit Report: {report.title}
                                </DialogTitle>
                                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                                    Please fill out the required information
                                    below.
                                </DialogDescription>
                            </div>
                            {isDeadlinePassed && (
                                <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                                    <Clock className="h-3.5 w-3.5" />
                                    Deadline Passed
                                </div>
                            )}
                        </div>
                    </DialogHeader>
                </div>

                <Form
                    {...ReportSubmissionController.store.form()}
                    encType="multipart/form-data"
                    onSuccess={() => {
                        setOpen(false);
                        setAnswers({});
                        setUploadedFiles({});
                    }}
                    className="px-6 pb-6"
                >
                    {({ processing, errors }) => (
                        <div className="space-y-8">
                            {/* Report Info Banner */}
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-foreground">
                                            Report Details
                                        </h4>
                                        <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    Deadline:{' '}
                                                    {formatDate(
                                                        report.deadline,
                                                    )}
                                                </span>
                                            </div>
                                            {report.program && (
                                                <div className="flex items-center gap-2">
                                                    <Folder className="h-3.5 w-3.5" />
                                                    <span>
                                                        Program:{' '}
                                                        {report.program.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hidden Report ID */}
                            <input
                                type="hidden"
                                name="report_id"
                                value={report.id}
                            />

                            {/* General Information Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                        <FileText className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        General Information
                                    </h3>
                                </div>

                                <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-sm font-medium text-foreground"
                                        >
                                            Description / Notes
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Add any additional notes or context about your submission..."
                                            className="min-h-[100px] border-input bg-background focus:border-ring focus:ring-ring"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Optional: Provide any clarifying
                                            information about your submission.
                                        </p>
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Required Attachments Section */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                            <FileUp className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Required Attachments
                                        </h3>
                                    </div>
                                </div>

                                {schema.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-border bg-muted/50 p-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                <CheckCircle2 className="h-6 w-6 text-muted-foreground/50" />
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-foreground">
                                                No attachments required
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                This report doesn't require any
                                                file attachments
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {schema.map((field, index) => (
                                            <div
                                                key={field.id}
                                                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20"
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <Label
                                                                htmlFor={
                                                                    field.id
                                                                }
                                                                className="text-sm font-medium text-foreground"
                                                            >
                                                                {field.label}
                                                                {field.required && (
                                                                    <span className="ml-1 text-destructive">
                                                                        *
                                                                    </span>
                                                                )}
                                                            </Label>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                Attachment #
                                                                {index + 1} of{' '}
                                                                {schema.length}
                                                            </p>
                                                        </div>
                                                        {uploadedFiles[
                                                            field.id
                                                        ] && (
                                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                                {
                                                                    uploadedFiles[
                                                                        field.id
                                                                    ].length
                                                                }{' '}
                                                                file(s) uploaded
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div
                                                        className={cn(
                                                            'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
                                                            uploadedFiles[
                                                                field.id
                                                            ]
                                                                ? 'border-primary/30 bg-primary/5'
                                                                : 'border-border bg-background hover:border-primary/30 hover:bg-accent/50',
                                                        )}
                                                        onClick={() => {
                                                            if (
                                                                !uploadedFiles[
                                                                    field.id
                                                                ]
                                                            ) {
                                                                document
                                                                    .getElementById(
                                                                        field.id,
                                                                    )
                                                                    ?.click();
                                                            }
                                                        }}
                                                    >
                                                        <Input
                                                            id={field.id}
                                                            type="file"
                                                            multiple
                                                            name={`submission_data[${field.id}][]`}
                                                            required={
                                                                field.required &&
                                                                !uploadedFiles[
                                                                    field.id
                                                                ]
                                                            }
                                                            className="hidden"
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    field.id,
                                                                    e.target
                                                                        .files,
                                                                )
                                                            }
                                                        />

                                                        {uploadedFiles[
                                                            field.id
                                                        ] ? (
                                                            <div className="p-4">
                                                                <div className="mb-3 flex items-center justify-between">
                                                                    <p className="text-sm font-medium text-foreground">
                                                                        Selected
                                                                        Files
                                                                    </p>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            clearFiles(
                                                                                field.id,
                                                                            );
                                                                        }}
                                                                    >
                                                                        Clear
                                                                        all
                                                                    </Button>
                                                                </div>
                                                                <ul className="space-y-2">
                                                                    {uploadedFiles[
                                                                        field.id
                                                                    ].map(
                                                                        (
                                                                            file,
                                                                            i,
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="flex items-center gap-3 text-sm"
                                                                            >
                                                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-primary/10">
                                                                                    <FileText className="h-4 w-4 text-primary" />
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="truncate font-medium text-foreground">
                                                                                        {
                                                                                            file.name
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {(
                                                                                            file.size /
                                                                                            1024
                                                                                        ).toFixed(
                                                                                            1,
                                                                                        )}{' '}
                                                                                        KB
                                                                                    </p>
                                                                                </div>
                                                                            </li>
                                                                        ),
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center py-6">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                                    <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                                                </div>
                                                                <p className="mt-2 text-sm font-medium text-foreground">
                                                                    Click to
                                                                    upload files
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    PDF, Images,
                                                                    DOCX (Max
                                                                    10MB each)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <InputError
                                                        message={
                                                            errors[
                                                                `submission_data.${field.id}`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reference Materials Section (if available) */}
                            {(report.references?.length > 0 ||
                                report.templates?.length > 0) && (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                            <Download className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Reference Materials
                                        </h3>
                                    </div>

                                    <div className="rounded-xl border border-border bg-card p-5">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {report.references?.length > 0 && (
                                                <div>
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Reference Files
                                                    </Label>
                                                    <ul className="mt-2 space-y-2">
                                                        {report.references.map(
                                                            (file, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex items-center gap-2 text-sm"
                                                                >
                                                                    <FileText className="h-4 w-4 text-primary" />
                                                                    <span className="flex-1 truncate text-foreground">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            {report.templates?.length > 0 && (
                                                <div>
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        Template Files
                                                    </Label>
                                                    <ul className="mt-2 space-y-2">
                                                        {report.templates.map(
                                                            (file, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex items-center gap-2 text-sm"
                                                                >
                                                                    <FileText className="h-4 w-4 text-primary" />
                                                                    <span className="flex-1 truncate text-foreground">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                                        <div>
                                            <p className="text-sm font-medium text-destructive">
                                                Please fix the following errors:
                                            </p>
                                            <ul className="mt-1 list-inside list-disc text-sm text-destructive/90">
                                                {Object.entries(errors).map(
                                                    ([key, value]) => (
                                                        <li key={key}>
                                                            {value as string}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 -mx-6 border-t border-border bg-card px-6 py-4">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[140px] bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                                Submitting...
                                            </div>
                                        ) : (
                                            'Submit Report'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
