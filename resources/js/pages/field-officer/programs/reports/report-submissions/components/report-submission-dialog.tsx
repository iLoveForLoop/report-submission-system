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
import { Report } from '@/types';
import { Form } from '@inertiajs/react';
import { Folder } from 'lucide-react';

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
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!hasSubmitted ? (
                <DialogTrigger asChild>
                    <div className="flex justify-end">
                        <Button type="button" variant="secondary">
                            <Folder className="mr-2 h-4 w-4" />
                            Submit Report
                        </Button>
                    </div>
                </DialogTrigger>
            ) : (
                <div className="flex justify-end">
                    <Button type="button" variant="secondary" disabled>
                        <Folder className="mr-2 h-4 w-4" />
                        You already Submitted
                    </Button>
                </div>
            )}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Report</DialogTitle>
                    <DialogDescription>
                        Upload proof files and submit the report.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ReportSubmissionController.store.form()}
                    encType="multipart/form-data"
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-4">
                            {/* Hidden report id */}
                            <Input hidden name="report_id" value={report.id} />

                            {/* Notes / description */}
                            <div>
                                <Label htmlFor="description">
                                    Description / Notes
                                </Label>
                                <Textarea id="description" name="description" />
                                <InputError message={errors.description} />
                            </div>

                            {/* Proof files */}
                            <div>
                                <Label htmlFor="proofs">Proof Files</Label>
                                <Input
                                    id="proofs"
                                    name="proofs[]"
                                    type="file"
                                    multiple
                                />
                                <InputError message={errors.proofs} />
                                <InputError message={errors['proofs.*']} />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Submitting...'
                                        : 'Submit Report'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
