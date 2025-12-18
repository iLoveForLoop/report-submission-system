import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

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
            <main className="h-screen landing-page">
                <div></div>
                <header className="py-4 px-20 flex items-center gap-2">
                    <img 
                        src="/Logo/DILG-logo.png" 
                        alt="DILG Logo" 
                        className='h-10'
                    />  
                    <p className='font-bold text-lg'>DILG RSR</p>
                </header>

                <div className='flex items-center justify-center mt-20'>
                    <section className='px-20 flex w-full'>
                        <div className='flex w-full items-center justify-center '>
                            {/* Headline and text */}
                            <div className='w-1/2 flex flex-col gap-6 bg-white p-2'>
                                <div className=''>
                                    <h4 className="text-5xl font-bold ">DILG Report Submission System</h4>
                                    <p className='text-lg font-semibold mt-2'>Department of the Interior and Local Government</p>
                                </div>
                                
                                <div>
                                    <p className='text-base my-3 text-gray-700'>A centralized system that enables efficient submission, tracking, and management of DTRs and official reports for DILG field operations.</p>
                                    <button 
                                        className='bg-blue-500 py-3 px-8 rounded flex items-center gap-2 text-white '
                                    >
                                        Login
                                        <img 
                                            src="/Icons/sign-in-fill.svg" 
                                            alt="Login Icon"
                                            className='h-5' 
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Logo */}
                            <div className='w-1/2 flex'>
                                <img 
                                    src="/Logo/DILG-logo.png" 
                                    alt="DILG Logo" 
                                    className='h-[450px] mx-auto'
                                />  
                            </div>
                        </div>  
                        
                    </section>
                </div>
            </main>
        </>
    );
}
