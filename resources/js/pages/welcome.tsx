import { login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/components/header/header'

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
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
            <main className="landing-page h-screen">

                <Header />

                <div className="mt-20 flex items-center justify-center">
                    <section className="flex w-full px-20">
                        <div className="flex w-full items-center justify-center">
                            {/* Headline and text */}
                            <div className="flex w-1/2 flex-col gap-6 bg-white p-2">
                                <div className="">
                                    <h4 className="text-5xl font-bold">
                                        DILG Report Submission System
                                    </h4>
                                    <p className="mt-2 text-lg font-semibold">
                                        Department of the Interior and Local
                                        Government
                                    </p>
                                </div>

                                <div>

                                    <p className="my-3 text-base text-gray-700">
                                        A centralized system that enables
                                        efficient submission, tracking, and
                                        management of DTRs and official reports
                                        for DILG field operations.
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
            </main>
        </>
    );
}


