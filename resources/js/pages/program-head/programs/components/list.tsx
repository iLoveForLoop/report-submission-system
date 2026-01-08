import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { cn } from '@/lib/utils';
import { Program } from '@/types';
import { router } from '@inertiajs/react';
import { Folders } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import EllipsisPopover from './ellipsis-popover';

interface Props {
    programs: Program[];
    selectReviewProgram: Program | null | undefined;
    setSelecReviewProgram: Dispatch<SetStateAction<Program | null | undefined>>;
}
export default function ListView({
    programs,
    selectReviewProgram,
    setSelecReviewProgram,
}: Props) {
    return (
        <div className="flex flex-col gap-5">
            {programs.map((program, index) => (
                <div
                    key={index}
                    onClick={() => {
                        setSelecReviewProgram(program);
                    }}
                    onDoubleClick={() => {
                        router.visit(ViewController.reports(program));
                    }}
                    className={cn(
                        'flex cursor-pointer items-center justify-start gap-5 rounded-sm border bg-background/50 px-4 py-2 transition-colors',
                        program.id === selectReviewProgram?.id
                            ? 'border-primary/50 bg-muted'
                            : 'hover:bg-muted/50',
                    )}
                >
                    <div>
                        <Folders className="" />
                    </div>
                    <div className="flex w-full items-center justify-between text-left">
                        <div>
                            <h2 className="">{program.name}</h2>
                        </div>
                        <div>
                            <EllipsisPopover program={program} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
