import ProgramController from '@/actions/App/Http/Controllers/ProgramController';
import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Program } from '@/types';
import { Form, Link, router } from '@inertiajs/react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

export default function EllipsisVerticalCard({
    program,
}: {
    program: Program;
}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger asChild>
                <button onClick={() => setOpen(true)}>
                    <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
                </button>
            </HoverCardTrigger>
            <HoverCardContent>
                <data value="">
                    <div>
                        <Link>Open</Link>
                    </div>
                    <div>
                        <Link>Edit</Link>
                    </div>
                    <div>
                        <Form
                            {...ProgramController.destroy.form(program)}
                            onSuccess={() => {
                                router.visit(ViewController.programs());
                                setOpen(false);
                            }}
                        >
                            <Button type="submit" variant={'destructive'}>
                                Delete
                            </Button>
                        </Form>
                    </div>
                </data>
            </HoverCardContent>
        </HoverCard>
    );
}
