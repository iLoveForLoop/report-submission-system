import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';

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
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="absolute top-5 left-5 flex items-center gap-1 hover:translate-x-1 duration-300">
                <ArrowLeft className="cursor-pointer w-5 h-5 font-semibold text-blue-900" />
                <Link href={home()} className='font-semibold text-blue-900'>Back</Link>
            </div>
            <div className="w-full max-w-md rounded-xl px-8 py-8 shadow-2xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-18 w-18 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            {/* <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p> */}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
