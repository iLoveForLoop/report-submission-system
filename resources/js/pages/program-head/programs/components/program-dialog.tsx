import ProgramController from '@/actions/App/Http/Controllers/ProgramController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Folder } from 'lucide-react';

type Coordinator = Pick<User, 'id' | 'name' | 'email' | 'avatar'>;

export default function ProgramDialog({
    coordinators,
    open,
    setOpen,
}: {
    coordinators: Coordinator[];
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-end">
                    <Button type="button" variant={'secondary'}>
                        <Folder className="mr-2 h-4 w-4" />
                        <span>Create new Program</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Create New Program </DialogTitle>
                    <DialogDescription>
                        Fill out the form below to create a new program.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...ProgramController.store.form()}
                    resetOnSuccess={['name', 'description', 'coordinator_id']}
                    onSuccess={() => {
                        setOpen(false);
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-3">
                            {/* form's fields */}
                            <div className="">
                                <Label htmlFor="name">Program Name</Label>
                                <Input name="name" id="name" />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    name="description"
                                    id="description"
                                    placeholder="Program Description..."
                                />
                                <InputError message={errors.description} />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="type"
                                    className="text-sm font-medium"
                                >
                                    Program Coordinator{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select name="coordinator_id">
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder="Select Coordinator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {coordinators.map((coordinator) => (
                                                <SelectItem
                                                    key={coordinator.id}
                                                    value={coordinator.id.toString()}
                                                >
                                                    {coordinator.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.coordinator_id} />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button type="submit">
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Program'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
