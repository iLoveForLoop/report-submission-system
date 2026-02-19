import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { EllipsisVertical, Eye, Trash } from 'lucide-react';

export default function EllipsisDropdown({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full p-2 transition-all duration-200 hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none">
                    <EllipsisVertical className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-40 border shadow-lg"
                sideOffset={8}
            >
                <DropdownMenuItem>
                    <Link
                        href={ViewController.viewUser(user)}
                        className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-muted focus:bg-muted"
                    >
                        <span>View</span>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => {
                        // Add your delete handler here
                        console.log('Delete user:', user.id);
                    }}
                >
                    <span>Delete</span>
                    <Trash className="h-4 w-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
