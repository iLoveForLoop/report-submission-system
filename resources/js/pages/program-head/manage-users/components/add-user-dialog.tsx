import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import UserForm from './form';

export default function AddUserDialog() {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus size={16} />
                    Add User
                </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[90vh] w-[95vw] !max-w-none flex-col sm:w-[85vw] lg:w-[70vw]">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Register a new user to the system
                    </DialogDescription>
                </DialogHeader>

                {/* THIS is the only scroll container */}
                <ScrollArea className="max-h-[calc(90vh-6rem)] flex-1 pr-4">
                    <UserForm setOpen={setOpen} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
