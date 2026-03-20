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
import { Form } from '@inertiajs/react';
import { Upload, UserPlus } from 'lucide-react';
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
        { value: 'program_head', label: 'Program Head' },
        { value: 'provincial_director', label: 'Provincial Director' },
    ];

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
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
                setOpen(false);
            }}
            className="space-y-8 pb-8"
        >
            {({ processing, errors }) => (
                <>
                    {/* Avatar Section */}
                    <div className="items-start gap-6 rounded-lg border bg-card p-6 lg:flex">
                        <div className="flex flex-col items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="group relative mb-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-all hover:border-primary hover:bg-muted lg:mb-0"
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserPlus
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
                            <Label className="text-sm font-semibold lg:text-base">
                                Profile Picture
                            </Label>
                            <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                Upload a profile picture for the user. Accepted
                                formats: PNG, JPG, JPEG
                            </p>
                            <div className="mt-4">
                                <Label
                                    htmlFor="employee_code"
                                    className="text-sm lg:text-base"
                                >
                                    Employee Code (Optional)
                                </Label>
                                <Input
                                    id="employee_code"
                                    name="employee_code"
                                    placeholder="e.g., 000000"
                                    className="mt-1.5 max-w-xs text-xs lg:text-base"
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
                                <h3 className="text-sm font-semibold lg:text-base">
                                    Personal Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Basic personal details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="first_name"
                                    className="text-sm lg:text-base"
                                >
                                    First Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    placeholder="John"
                                    className="text-sm lg:text-base"
                                    required
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="middle_name"
                                    className="text-sm lg:text-base"
                                >
                                    Middle Name
                                </Label>
                                <Input
                                    id="middle_name"
                                    name="middle_name"
                                    placeholder="Wail"
                                    className="text-sm lg:text-base"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="last_name"
                                    className="text-sm lg:text-base"
                                >
                                    Last Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Doe"
                                    required
                                    className="text-sm lg:text-base"
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="gender"
                                    className="text-sm lg:text-base"
                                >
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
                                <Label
                                    htmlFor="birthday"
                                    className="text-sm lg:text-base"
                                >
                                    Birthday
                                </Label>
                                <Input
                                    id="birthday"
                                    name="birthday"
                                    type="date"
                                    className="text-sm lg:text-base"
                                />
                                <InputError message={errors.birthday} />
                            </div>
                        </div>

                        {/* Work Information */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold lg:text-base">
                                    Work Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Job and department details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="department"
                                    className="text-sm lg:text-base"
                                >
                                    Department{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="department"
                                    name="department"
                                    placeholder="e.g., DILG - Tubigon"
                                    required
                                    className="text-sm lg:text-base"
                                />

                                <InputError message={errors.department} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="position"
                                    className="text-sm lg:text-base"
                                >
                                    Position{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="position"
                                    name="position"
                                    placeholder="e.g., LGOO VI"
                                    required
                                    className="text-sm lg:text-base"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="cluster"
                                    className="text-sm lg:text-base"
                                >
                                    Cluster
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select name="cluster" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select cluster" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={'M&M'}>
                                            M&M
                                        </SelectItem>
                                        <SelectItem value={"D'ONE"}>
                                            D'ONE
                                        </SelectItem>
                                        {/* <SelectItem value={"Provincial"}>
                                            Provincial
                                        </SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="role"
                                    className="text-sm lg:text-base"
                                >
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
                                <h3 className="text-sm font-semibold lg:text-base">
                                    Account Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Login credentials
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm lg:text-base"
                                >
                                    Email{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john.doe@company.com"
                                    required
                                    className="text-sm lg:text-base"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm lg:text-base"
                                >
                                    Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="text-sm lg:text-base"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm lg:text-base"
                                >
                                    Confirm Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="text-sm lg:text-base"
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
