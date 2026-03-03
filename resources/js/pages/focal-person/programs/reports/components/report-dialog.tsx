// report-dialog.tsx
import ReportController from '@/actions/App/Http/Controllers/ReportController';
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
import { Program } from '@/types';
import { Form } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Download,
    FileSignature,
    FileText,
    FileUp,
    Folder,
    Plus,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface ReportDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    program: Program;
}

type FieldType = 'file';

interface DynamicField {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
}

export default function ReportDialog({
    setOpen,
    open,
    program,
}: ReportDialogProps) {
    const [fields, setFields] = useState<DynamicField[]>([]);
    const [templateFiles, setTemplateFiles] = useState<FileList | null>(null);
    const [referenceFiles, setReferenceFiles] = useState<FileList | null>(null);
    const referenceFileInputRef = useRef<HTMLInputElement>(null);
    const templateFileInputRef = useRef<HTMLInputElement>(null);

    const addField = () => {
        setFields([
            ...fields,
            {
                id: crypto.randomUUID(),
                label: '',
                type: 'file',
                required: true,
            },
        ]);
    };

    const updateLabel = (id: string, value: string) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === id ? { ...field, label: value } : field,
            ),
        );
    };

    const removeField = (id: string) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
    };

    const clearReferenceFiles = () => {
        setReferenceFiles(null);
        if (referenceFileInputRef.current) {
            referenceFileInputRef.current.value = '';
        }
    };

    const clearTemplateFiles = () => {
        setTemplateFiles(null);
        if (templateFileInputRef.current) {
            templateFileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-end">
                    <Button type="button" variant={'secondary'}>
                        <Folder className="mr-2 h-4 w-4" />
                        <span className="text-xs">Create New Report</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
                <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-foreground">
                            Create New Report
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Define the report details and upload any templates
                            for the officers.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form
                    {...ReportController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        setFields([]);
                        setTemplateFiles(null);
                        setReferenceFiles(null);
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-8 px-6 pb-6">
                            {/* Basic Information Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                        <FileSignature className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Basic Information
                                    </h3>
                                </div>

                                <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="title"
                                            className="text-sm font-medium text-foreground"
                                        >
                                            Report Title{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="e.g. Q1 Compliance Report"
                                            className="border-input bg-background focus:border-ring focus:ring-ring"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-sm font-medium text-foreground"
                                        >
                                            Report Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Provide instructions or context for the officers..."
                                            className="min-h-[100px] border-input bg-background focus:border-ring focus:ring-ring"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Include any specific guidelines or
                                            requirements for this report.
                                        </p>
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    {/* Hidden Program ID */}
                                    <Input
                                        hidden
                                        name="program_id"
                                        value={program.id}
                                        readOnly
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deadline"
                                                className="text-sm font-medium text-foreground"
                                            >
                                                Deadline{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    name="deadline"
                                                    id="deadline"
                                                    className="border-input bg-background pl-9 focus:border-ring focus:ring-ring"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.deadline}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Required Attachments Section */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                            <FileText className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Required Attachments
                                        </h3>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addField}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-border text-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <Plus className="mr-1 h-3.5 w-3.5" />
                                        Add Attachment Field
                                    </Button>
                                </div>

                                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                                    {fields.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                <FileText className="h-6 w-6 text-muted-foreground/50" />
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-foreground">
                                                No attachments requested
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Add attachment fields that
                                                officers need to upload
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="group relative flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-3 transition-all hover:border-border hover:bg-card"
                                                >
                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                        <FileText className="h-4 w-4" />
                                                    </div>

                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-xs font-medium text-muted-foreground">
                                                            Attachment Name #
                                                            {index + 1}
                                                        </Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) =>
                                                                updateLabel(
                                                                    field.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="e.g. Signed Agreement, Financial Statement..."
                                                            className="h-9 border-input bg-background text-sm focus:border-ring focus:ring-ring"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Officers will be
                                                            required to upload
                                                            this file
                                                        </p>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() =>
                                                            removeField(
                                                                field.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reference Files Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                        <Download className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Reference Materials
                                    </h3>
                                </div>

                                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between">
                                        <Label className="text-sm font-medium text-foreground">
                                            Upload Reference Files
                                        </Label>
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                            Optional
                                        </span>
                                    </div>

                                    <div
                                        className={cn(
                                            'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
                                            referenceFiles
                                                ? 'border-primary/30 bg-primary/5'
                                                : 'border-border bg-background hover:border-primary/30 hover:bg-accent/50',
                                        )}
                                        onClick={() =>
                                            referenceFileInputRef.current?.click()
                                        }
                                    >
                                        <Input
                                            ref={referenceFileInputRef}
                                            type="file"
                                            multiple
                                            name="reference_files[]"
                                            className="hidden"
                                            onChange={(e) =>
                                                setReferenceFiles(
                                                    e.target.files,
                                                )
                                            }
                                        />

                                        {referenceFiles &&
                                        referenceFiles.length > 0 ? (
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {referenceFiles.length}{' '}
                                                        file(s) selected
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearReferenceFiles();
                                                        }}
                                                    >
                                                        Clear all
                                                    </Button>
                                                </div>
                                                <ul className="space-y-1">
                                                    {Array.from(
                                                        referenceFiles,
                                                    ).map((file, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            <span className="flex-1 truncate text-foreground">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {(
                                                                    file.size /
                                                                    1024
                                                                ).toFixed(
                                                                    1,
                                                                )}{' '}
                                                                KB
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-8">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="mt-2 text-sm font-medium text-foreground">
                                                    Click to upload reference
                                                    files
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PDF, DOCX, XLSX (Max 10MB
                                                    each)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Templates Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                        <FileUp className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Report Templates
                                    </h3>
                                </div>

                                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between">
                                        <Label className="text-sm font-medium text-foreground">
                                            Upload Template Files
                                        </Label>
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                            Optional
                                        </span>
                                    </div>

                                    <div
                                        className={cn(
                                            'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
                                            templateFiles
                                                ? 'border-primary/30 bg-primary/5'
                                                : 'border-border bg-background hover:border-primary/30 hover:bg-accent/50',
                                        )}
                                        onClick={() =>
                                            templateFileInputRef.current?.click()
                                        }
                                    >
                                        <Input
                                            ref={templateFileInputRef}
                                            type="file"
                                            multiple
                                            name="template_files[]"
                                            className="hidden"
                                            onChange={(e) =>
                                                setTemplateFiles(e.target.files)
                                            }
                                        />

                                        {templateFiles &&
                                        templateFiles.length > 0 ? (
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {templateFiles.length}{' '}
                                                        file(s) selected
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearTemplateFiles();
                                                        }}
                                                    >
                                                        Clear all
                                                    </Button>
                                                </div>
                                                <ul className="space-y-1">
                                                    {Array.from(
                                                        templateFiles,
                                                    ).map((file, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <FileText className="h-4 w-4 text-primary" />
                                                            <span className="flex-1 truncate text-foreground">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {(
                                                                    file.size /
                                                                    1024
                                                                ).toFixed(
                                                                    1,
                                                                )}{' '}
                                                                KB
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-8">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                    <FileUp className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="mt-2 text-sm font-medium text-foreground">
                                                    Click to upload template
                                                    files
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PDF, DOCX, XLSX (Max 10MB
                                                    each)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Schema (Hidden) */}
                            <Input
                                hidden
                                name="form_schema"
                                value={JSON.stringify(fields)}
                                readOnly
                            />

                            {/* Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                                        <div>
                                            <p className="text-sm font-medium text-destructive">
                                                Please fix the following errors:
                                            </p>
                                            <ul className="mt-1 list-inside list-disc text-sm text-destructive/90">
                                                {Object.entries(errors).map(
                                                    ([key, value]) => (
                                                        <li key={key}>
                                                            {value}
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
                                        className="min-w-[120px] bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                                Creating...
                                            </div>
                                        ) : (
                                            'Create Report'
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
