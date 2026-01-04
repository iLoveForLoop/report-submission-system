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
import { Program } from '@/types';
import { Form } from '@inertiajs/react';
import { Folder } from 'lucide-react';

interface Report {
    title: string;
    deadline: Date;
    final_deadline: Date;
}

interface ReportDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    program: Program;
}

export default function ReportDialog({
    setOpen,
    open,
    program,
}: ReportDialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-end">
                    <Button type="button" variant={'secondary'}>
                        <Folder className="mr-2 h-4 w-4" />
                        <span>Create new Report</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Create New Report</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to create a new report.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...ReportController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-3">
                            {/* form's fields */}
                            <div className="">
                                <Label htmlFor="title">Report Title</Label>
                                <Input id="title" name="title" />
                                <InputError message={errors.title} />
                            </div>
                            <div>
                                <Label htmlFor="description">
                                    Report Description
                                </Label>
                                <Textarea id="description" name="description" />
                                <InputError message={errors.description} />
                            </div>
                            <Input
                                hidden
                                name="program_id"
                                value={program.id}
                            />
                            <div>
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input
                                    type="date"
                                    name="deadline"
                                    id="deadline"
                                />
                            </div>
                            <div>
                                <Label htmlFor="final_deadline">
                                    Final Deadline
                                </Label>
                                <Input
                                    type="date"
                                    name="final_deadline"
                                    id="final_deadline"
                                />
                            </div>
                            {/* If type is required */}
                            {/* <div className="space-y-2">
                                <Label
                                    htmlFor="type"
                                    className="text-sm font-medium"
                                >
                                    Report Type{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select name="type" defaultValue={''}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="male">
                                                Sample TYpe
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Sample TYpe
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div> */}

                            <div className="mt-4 flex justify-end">
                                <Button type="submit">
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Report'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
