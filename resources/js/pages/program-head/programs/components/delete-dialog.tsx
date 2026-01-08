import ProgramController from '@/actions/App/Http/Controllers/ProgramController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Program } from '@/types';
import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
    program: Program;
    setOpenPop: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteProgramDialog({ program, setOpenPop }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-3 text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {program.name}</DialogTitle>
                    <DialogDescription>
                        This action will permanently delete {program.name} from
                        the system. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ProgramController.destroy.form(program)}
                    onSuccess={() => {
                        setOpen(false);
                        setOpenPop(false);
                    }}
                >
                    <div className="mb-2">
                        <p>Are you sure you want to delete {program.name}?</p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive">Delete</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
