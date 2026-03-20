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
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Upload, UserPen } from 'lucide-react';
import { useRef, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES = [
    { value: 'field_officer', label: 'Field Officer' },
    { value: 'focal_person', label: 'Focal Person' },
    { value: 'program_head', label: 'Program Head' },
    { value: 'provincial_director', label: 'Provincial Director' },
] as const;

const GENDERS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
] as const;

const CLUSTERS = [
    { value: 'M&M', label: 'M&M' },
    { value: "D'ONE", label: "D'ONE" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
    user: User;
    closeDialog: () => void;
}

export default function EditProfileForm({ user, closeDialog }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    return (
        // ── Key fix: use update(user.id) not store() ──────────────────────────
        // UserController.update.form(user.id) resolves to PUT /users/{id}
        // which maps to the update() controller method.
        <Form
            {...UserController.update.form(user.id)}
            onSuccess={() => closeDialog()}
            className="space-y-8 pb-8"
        >
            {({ processing, errors }) => (
                <>
                    {/* ── Avatar ────────────────────────────────────────────── */}
                    <div className="items-start gap-6 rounded-lg border bg-card p-6 lg:flex">
                        <div className="flex flex-col items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="group relative mb-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-all hover:border-primary hover:bg-muted lg:mb-0"
                            >
                                {previewUrl || user.avatar_url ? (
                                    <img
                                        src={previewUrl ?? user.avatar_url}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                'none';
                                            e.currentTarget.parentElement!.innerHTML =
                                                user.name
                                                    .charAt(0)
                                                    .toUpperCase();
                                        }}
                                    />
                                ) : (
                                    <UserPen
                                        size={32}
                                        className="text-muted-foreground"
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100">
                                    <Upload size={20} className="text-white" />
                                </div>
                            </button>

                            <Input
                                ref={fileInputRef}
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
                                Upload a new photo. Accepted formats: PNG, JPG,
                                JPEG
                            </p>
                            <div className="mt-4">
                                <Label
                                    htmlFor="employee_code"
                                    className="text-sm lg:text-base"
                                >
                                    Employee Code
                                </Label>
                                <Input
                                    id="employee_code"
                                    name="employee_code"
                                    defaultValue={user.employee_code ?? ''}
                                    className="mt-1.5 max-w-xs text-sm lg:text-base"
                                />
                                <InputError message={errors.employee_code} />
                            </div>
                        </div>
                    </div>

                    {/* ── Main grid ─────────────────────────────────────────── */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Personal */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-2">
                                <h3 className="text-sm font-semibold lg:text-base">
                                    Personal Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Basic personal details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm">
                                    First Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    defaultValue={user.first_name}
                                    required
                                    className="text-sm"
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="middle_name"
                                    className="text-sm"
                                >
                                    Middle Name
                                </Label>
                                <Input
                                    id="middle_name"
                                    name="middle_name"
                                    defaultValue={user.middle_name ?? ''}
                                    className="text-sm"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm">
                                    Last Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    defaultValue={user.last_name}
                                    required
                                    className="text-sm"
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            {/* Gender select */}
                            <div className="space-y-2">
                                <Label className="text-sm">
                                    Gender{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    name="gender"
                                    defaultValue={user.gender ?? ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GENDERS.map((g) => (
                                            <SelectItem
                                                key={g.value}
                                                value={g.value}
                                            >
                                                {g.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthday" className="text-sm">
                                    Birthday
                                </Label>
                                <Input
                                    id="birthday"
                                    name="birthday"
                                    type="date"
                                    defaultValue={
                                        user.birthday
                                            ? new Date(user.birthday)
                                                  .toISOString()
                                                  .split('T')[0]
                                            : ''
                                    }
                                    className="text-sm"
                                />
                                <InputError message={errors.birthday} />
                            </div>
                        </div>

                        {/* Work */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-2">
                                <h3 className="text-sm font-semibold lg:text-base">
                                    Work Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Job and department details
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-sm">
                                    Department{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="department"
                                    name="department"
                                    defaultValue={user.department ?? ''}
                                    required
                                    className="text-sm"
                                />
                                <InputError message={errors.department} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position" className="text-sm">
                                    Position{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="position"
                                    name="position"
                                    defaultValue={user.position ?? ''}
                                    required
                                    className="text-sm"
                                />
                                <InputError message={errors.position} />
                            </div>

                            {/* Cluster select — fixed: now has defaultValue */}
                            <div className="space-y-2">
                                <Label className="text-sm">
                                    Cluster{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    name="cluster"
                                    defaultValue={user.cluster ?? ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select cluster" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLUSTERS.map((c) => (
                                            <SelectItem
                                                key={c.value}
                                                value={c.value}
                                            >
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.cluster} />
                            </div>

                            {/* Role select */}
                            <div className="space-y-2">
                                <Label className="text-sm">
                                    System Role{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    name="role"
                                    defaultValue={user.role ?? ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((r) => (
                                            <SelectItem
                                                key={r.value}
                                                value={r.value}
                                            >
                                                {r.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>
                        </div>

                        {/* Account */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className="mb-2">
                                <h3 className="text-sm font-semibold lg:text-base">
                                    Account Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Login credentials
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm">
                                    Email{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    required
                                    className="text-sm"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm">
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Only fill this in if you want to change the
                                    password.
                                </p>
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm"
                                >
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ───────────────────────────────────────────── */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialog}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
