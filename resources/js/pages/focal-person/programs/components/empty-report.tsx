import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Folder } from 'lucide-react';

export default function EmptyReport({
    setIsOpen,
}: {
    setIsOpen: (open: boolean) => void;
}) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <Folder />
                </EmptyMedia>
                <EmptyTitle>No Reports Created Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any reports yet. Get started by
                    creating your first project.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button onClick={() => setIsOpen(true)}>
                        Create Report
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}
