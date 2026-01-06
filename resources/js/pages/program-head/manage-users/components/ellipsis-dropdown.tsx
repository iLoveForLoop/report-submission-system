import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

export default function EllipsisDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
            </DropdownMenuTrigger>
        </DropdownMenu>
    );
}
