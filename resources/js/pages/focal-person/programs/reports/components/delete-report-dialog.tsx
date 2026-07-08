// components/delete-report-dialog.tsx
import ReportController from '@/actions/App/Http/Controllers/ReportController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Report } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface Props {
    report: Report;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteReportDialog({
    report,
    open,
    onOpenChange,
}: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(ReportController.destroy.url(report.id), {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-center text-lg">
                        Delete Report
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-muted-foreground">
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-foreground">
                            "{report.title}"
                        </span>
                        ? This will permanently remove the report and all
                        associated submissions and files. This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                                Deleting…
                            </div>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Report
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
