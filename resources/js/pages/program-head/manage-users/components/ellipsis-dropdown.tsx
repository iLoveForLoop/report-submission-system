import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import EditUserDialog from './edit-user-dialog';

export default function EllipsisDropdown({ user }: { user: User }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    function handleDelete() {
        router.delete(UserController.destroy(user), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="rounded-full p-2 transition-all duration-200 hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
                        <EllipsisVertical className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-44 rounded-xl border shadow-md"
                    sideOffset={8}
                >
                    {/* View */}
                    <DropdownMenuItem asChild>
                        <Link
                            href={ViewController.viewUser(user)}
                            className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted dark:hover:bg-gray-700"
                        >
                            <span>View</span>
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                    </DropdownMenuItem>

                    {/* Edit */}
                    <DropdownMenuItem
                        onClick={() => setIsEditOpen(true)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted dark:hover:bg-gray-700"
                    >
                        <div className="flex w-full items-center justify-between">
                            <span>Edit</span>
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                    </DropdownMenuItem>

                    <hr className="my-1" />

                    {/* Delete */}
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-destructive focus:text-destructive"
                    >
                        <div className="flex w-full items-center justify-between">
                            <span>Delete</span>
                            <Trash className="h-4 w-4 text-destructive" />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditUserDialog
                openDialog={isEditOpen}
                closeDialog={() => setIsEditOpen(false)}
                user={user}
            />

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete{' '}
                            <strong>{user.name}</strong> and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="!bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
