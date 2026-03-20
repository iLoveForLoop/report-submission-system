import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import EditUserDialog from './edit-user-dialog';

export default function EllipsisDropdown({ user }: { user: User }) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
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
                        className="flex items-center gap-3"
                    >
                        <Eye className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <span>View</span>
                    </Link>
                </DropdownMenuItem>

                {/* Edit */}
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <div className="flex items-center gap-3">
                        <Pencil className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <span>Edit</span>
                    </div>
                </DropdownMenuItem>

                {/* Delete */}
                <DropdownMenuItem
                    onClick={() => console.log('Delete user:', user.id)}
                    className="text-destructive focus:text-destructive"
                >
                    <div className="flex items-center gap-3">
                        <Trash className="h-4 w-4" />
                        <span>Delete</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>

            <EditUserDialog
                openDialog={isEditOpen}
                closeDialog={() => setIsEditOpen(false)}
                user={user}
            />
        </DropdownMenu>
    );
}
