import Developers from '@/components/developers/developers';
import Header from '@/components/header/header';
import { login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
export default function Welcome({
    canRegister = true,
    department = "DILG Region VII - Bohol",
    headline = "Report Submission System",
    description = "A centralized system that enables efficient submission, tracking, and management of DTRs and official reports for DILG field operations."
}: {
    canRegister?: boolean;
    department?: string;
    headline?: string;
    subtitle?: string;
    description?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <main className="landing-page relative h-screen">
                <Header />

                <div className="mt-20 flex items-center justify-center">
                    <section className="flex w-full px-20">
                        <div className="flex w-full items-center justify-center">
                            {/* Headline and text */}
                            <div className='w-1/2 flex flex-col gap-2'>
                                <div className=''>
                                    <p className='inline-flex px-3 py-1 rounded-md mb-5 border border-blue-500 bg-blue-100  font-medium items-center gap-2 text-xs text-blue-600'
                                    >
                                        <div className='h-2 bg-blue-500 w-2 rounded-full animate-pulse'></div>
                                        { department }
                                    </p>
                                    <h4 className="text-7xl font-extrabold text-blue-600 dark:text-foreground">{ headline }</h4>
                                </div>

                                <div>
                                    <p className="my-3 text-base text-gray-900 dark:text-gray-300">
                                        { description }
                                    </p>

                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded bg-blue-500 px-8 py-3 text-white"
                                    >
                                        Login
                                        <img
                                            src="/Icons/sign-in-fill.svg"
                                            alt="Login Icon"
                                            className="h-5"
                                        />
                                    </Link>
                                </div>
                            </div>

                            {/* Logo */}
                            <div className="flex w-1/2">
                                <img
                                    src="/Logo/DILG-logo.png"
                                    alt="DILG Logo"
                                    className="mx-auto h-[450px]"
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <Developers />
            </main>
        </>
    );
}
