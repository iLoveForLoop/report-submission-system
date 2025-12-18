import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import Developers from '@/components/developers/developers';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="login-page flex min-h-svh flex-col items-center justify-center gap-6 p-6 relative">
            <div className="absolute top-5 left-5 flex items-center gap-1 duration-300 hover:translate-x-1">
                <ArrowLeft className="h-5 w-5 cursor-pointer font-semibold text-blue-900" />
                <Link href={home()} className="font-semibold text-blue-900">
                    Back
                </Link>
            </div>
            <div className="w-full max-w-4xl rounded-xl bg-white dark:bg-accent px-8 py-8 shadow-2xl">
                <div className="flex gap-8">
                    {/* Left side - Logo and Dialog Title */}
                    <div className="hidden flex-1 flex-col items-center justify-center p-8 md:flex">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <AppLogoIcon className="h-32 w-32 fill-current text-[var(--foreground)] dark:text-white" />
                            <div className="space-y-4">
                                <h1 className="text-3xl font-semibold text-gray-800 dark:text-neutral-100">
                                    {title}
                                </h1>

                            </div>
                        </div>
                    </div>

                    {/* Divider - only on larger screens */}
                    <div className="hidden md:block">
                        <div className="h-full w-px bg-gray-200"></div>
                    </div>

                    {/* Right side - Welcome text and Login form */}
                    <div className="flex-1 p-6 md:p-8">
                        <div className="flex flex-col gap-8">
                            {/* Mobile logo and title */}
                            <div className="flex flex-col items-center gap-4 md:hidden">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <AppLogoIcon className="h-16 w-16 fill-current text-[var(--foreground)] dark:text-white" />
                                    <span className="sr-only">{title}</span>
                                </Link>
                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium">
                                        {title}
                                    </h1>
                                </div>
                            </div>

                            {/* Welcome text for desktop */}
                            <div className="hidden space-y-2 md:block">
                                <h1 className="text-3xl font-semibold text-gray-800 dark:text-neutral-100">
                                    Welcome back!
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-neutral-100">
                                    Sign in to your account to continue.

                                </p>
                            </div>

                            {/* Welcome text for mobile */}
                            <div className="space-y-2 text-center md:hidden">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Welcome back!
                                </h1>
                                <p className="text-gray-600">
                                    Sign in to your account to continue.

                                </p>
                            </div>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <Developers />
        </div>
    );
}
