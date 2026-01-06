import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Form, router } from '@inertiajs/react';
import { Upload, User } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    setOpen: (open: boolean) => void;
}

export default function UserForm({ setOpen }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const roles = [
        { value: 'field_officer', label: 'Field Officer' },
        { value: 'focal_person', label: 'Focal Person' },
    ];

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
    ];
    const departments = [
        { value: 'provincial office', label: 'Provincial Office' },
    ];

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <Form
            {...UserController.store.form()}
            onSuccess={() => {
                router.visit(ViewController.manageUsers());
            }}
            className="space-y-8 pb-8"
        >
            {({ processing, errors }) => (
                <>
                    {/* Avatar Section */}
                    <div className="flex items-start gap-6 rounded-lg border bg-card p-6">
                        <div className="flex flex-col items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-all hover:border-primary hover:bg-muted"
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User
                                        size={32}
                                        className="text-muted-foreground"
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Upload size={20} className="text-white" />
                                </div>
                            </button>
                            <Input
                                ref={fileInputRef}
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <InputError message={errors.avatar} />
                        </div>
                        <div className="flex-1">
                            <Label className="text-base font-semibold">
                                Profile Picture
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Upload a profile picture for the user. Accepted
                                formats: PNG, JPG, JPEG
                            </p>
                            <div className="mt-4">
                                <Label
                                    htmlFor="employee_code"
                                    className="text-sm"
                                >
                                    Employee Code (Optional)
                                </Label>
                                <Input
                                    id="employee_code"
                                    name="employee_code"
                                    placeholder="e.g., 000000"
                                    className="mt-1.5 max-w-xs"
                                />
                                <InputError message={errors.employee_code} />
                            </div>
                        </div>
                    </div>

                    {/* Main Form Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Personal Information */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold">
                                    Personal Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Basic personal details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="first_name">
                                    First Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    placeholder="John"
                                    required
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="middle_name">Middle Name</Label>
                                <Input
                                    id="middle_name"
                                    name="middle_name"
                                    placeholder="Wail"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name">
                                    Last Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Doe"
                                    required
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">
                                    Gender{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select name="gender" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genders.map((gender) => (
                                            <SelectItem
                                                key={gender.value}
                                                value={gender.value}
                                            >
                                                {gender.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthday">Birthday</Label>
                                <Input
                                    id="birthday"
                                    name="birthday"
                                    type="date"
                                />
                                <InputError message={errors.birthday} />
                            </div>
                        </div>

                        {/* Work Information */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold">
                                    Work Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Job and department details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">
                                    Department{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                {/* <Input
                            id="department"
                            name="department"
                            placeholder="e.g., Human Resources"
                            required
                        /> */}
                                <Select name="department" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">
                                    Position{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="position"
                                    name="position"
                                    placeholder="e.g., Senior Manager"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    System Role{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select name="role" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold">
                                    Account Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Login credentials
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@company.com"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            onClick={() => {
                                setOpen(false);
                            }}
                            type="button"
                            variant="outline"
                            size="lg"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="lg">
                            {processing ? 'Adding...' : 'Add User'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
