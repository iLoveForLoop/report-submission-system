import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { User } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import EllipsisDropdown from './ellipsis-dropdown';

interface Props {
    users: User[];
    selectedUsers: Set<number>;
    setSelectedUsers: Dispatch<SetStateAction<Set<number>>>;
}

const headers = [
    'User name',
    'Emp Code',
    'Position',
    'Department',
    'Role',
    'Date Added',
];

export default function UsersTable({
    users,
    selectedUsers,
    setSelectedUsers,
}: Props) {
    // Check if all users are selected
    const allSelected = selectedUsers.size === users.length && users.length > 0;

    // Check if some (but not all) users are selected
    const someSelected =
        selectedUsers.size > 0 && selectedUsers.size < users.length;

    // Toggle select all
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map((user) => user.id)));
        }
    };

    // Toggle individual user selection
    const handleSelectUser = (userId: number) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Checkbox
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all users"
                        />
                    </TableHead>
                    {headers.map((header, idx) => (
                        <TableHead key={idx}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <Checkbox
                                checked={selectedUsers.has(user.id)}
                                onCheckedChange={() =>
                                    handleSelectUser(user.id)
                                }
                                aria-label={`Select ${user.name}`}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3 rounded-lg p-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{user.employee_code}</TableCell>
                        <TableCell>{user.position}</TableCell>
                        <TableCell className="capitalize">
                            {user.department}
                        </TableCell>
                        <TableCell>
                            {user.role === 'field_officer'
                                ? 'Field Officer'
                                : 'Focal Person'}
                        </TableCell>
                        <TableCell>
                            {new Date(user.created_at).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </TableCell>
                        <TableCell>
                            <EllipsisDropdown />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
