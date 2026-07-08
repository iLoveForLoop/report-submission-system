import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    console.log(auth);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        encType="multipart/form-data"
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Avatar Upload */}
                                <div className="grid gap-2">
                                    <Label htmlFor="avatar">
                                        Profile Avatar
                                    </Label>
                                    <p className="-mt-1 text-xs text-muted-foreground">
                                        Click the avatar to upload a new photo
                                    </p>

                                    <div className="mt-1 flex items-center gap-5">
                                        {/* Clickable avatar preview */}
                                        <div
                                            className="group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border"
                                            onClick={() =>
                                                document
                                                    .getElementById('avatar')
                                                    ?.click()
                                            }
                                        >
                                            <img
                                                id="avatar-preview-img"
                                                src={
                                                    auth.user.avatar_url ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=E6F1FB&color=185FA5&size=80`
                                                }
                                                alt="Avatar preview"
                                                className="block h-20 w-20 rounded-full object-cover"
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line
                                                        x1="12"
                                                        y1="3"
                                                        x2="12"
                                                        y2="15"
                                                    />
                                                </svg>
                                                <span className="mt-1 text-[10px] font-medium text-white">
                                                    Change
                                                </span>
                                            </div>
                                        </div>

                                        {/* File info + browse button */}
                                        <div>
                                            <p
                                                id="avatar-file-name"
                                                className="mb-1.5 text-sm text-muted-foreground"
                                            >
                                                No file chosen
                                            </p>
                                            <button
                                                type="button"
                                                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-muted"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            'avatar',
                                                        )
                                                        ?.click()
                                                }
                                            >
                                                Browse file
                                            </button>
                                            <p className="mt-1.5 text-[11px] text-muted-foreground">
                                                PNG, JPG, WEBP up to 2MB
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hidden native file input — keeps name="avatar" for the form */}
                                    <Input
                                        id="avatar"
                                        type="file"
                                        name="avatar"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            const label =
                                                document.getElementById(
                                                    'avatar-file-name',
                                                );
                                            if (!file) return;
                                            if (label)
                                                label.textContent = file.name;
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                const img =
                                                    document.getElementById(
                                                        'avatar-preview-img',
                                                    ) as HTMLImageElement;
                                                if (img && ev.target?.result)
                                                    img.src = ev.target
                                                        .result as string;
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.avatar}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
