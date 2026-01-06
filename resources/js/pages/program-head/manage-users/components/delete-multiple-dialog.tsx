import UserController from '@/actions/App/Http/Controllers/UserController';
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
import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    users_id: number[];
}

export default function DeleteMultipleDialog({ users_id }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete {users_id.length}{' '}
                        {users_id.length === 1 ? 'user' : 'users'}?
                    </DialogTitle>
                    <DialogDescription>
                        This action will permanently delete {users_id.length}{' '}
                        {users_id.length === 1 ? 'user' : 'users'} from the
                        system. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...UserController.deleteMultipleUsers.form.delete()}
                    onSuccess={() => {
                        setOpen(false);
                    }}
                >
                    <div>
                        <p>
                            Are you sure you want to delete {users_id.length}{' '}
                            {users_id.length === 1 ? 'user' : 'users'}?
                        </p>
                    </div>

                    {users_id.map((id) => (
                        <input
                            key={id}
                            type="hidden"
                            name="users_id[]"
                            value={id}
                        />
                    ))}

                    <DialogFooter>
                        <Button>Cancel</Button>
                        <Button variant="destructive">Delete</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
