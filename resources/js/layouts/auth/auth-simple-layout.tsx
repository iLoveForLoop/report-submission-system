//AuthLayoutTemplate.tsx
import AppLogoIcon from '@/components/app-logo-icon';
import Developers from '@/components/developers/developers';
import { home } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

// Animation variants
const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
};

const slideInVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

const scaleInVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 150,
            damping: 15,
            delay: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 120,
            damping: 15,
            delay: 0.3,
        },
    },
};

const backButtonVariants = {
    hover: {
        x: 5,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 10,
        },
    },

};

export default function AuthSimpleLayout({
    children,
    title,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <>
            <Head title="Login">
                {/* <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                /> */}
            </Head>
            <motion.div
                className="login-page relative flex min-h-svh flex-col items-center justify-center gap-6 p-6"
                initial="hidden"
                animate="visible"
                variants={pageVariants}
            >
                {/* Back Button */}
                <motion.div
                    className="absolute top-5 left-5 flex items-center gap-1"
                    variants={slideInVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <motion.div
                        variants={backButtonVariants}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft className="h-5 w-5 cursor-pointer font-semibold text-blue-900" />
                        <Link
                            href={home()}
                            className="font-semibold text-blue-900"
                        >
                            Back
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    className="w-full max-w-4xl rounded-xl bg-white px-8 py-8 shadow-2xl dark:bg-accent"
                    variants={scaleInVariants}
                >
                    <div className="flex gap-8">
                        {/* Left side - Logo and Dialog Title */}
                        <motion.div
                            className="hidden flex-1 flex-col items-center justify-center p-8 md:flex"
                            variants={fadeInVariants}
                        >
                            <div className="flex flex-col items-center gap-6 text-center">
                                <motion.div
                                    initial={{ rotate: -10, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 120,
                                        damping: 15,
                                        delay: 0.4,
                                    }}
                                >
                                    <AppLogoIcon className="h-32 w-32 fill-current text-[var(--foreground)] dark:text-white" />
                                </motion.div>
                                <motion.div
                                    className="space-y-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-neutral-100">
                                        {title}
                                    </h1>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Divider - only on larger screens */}
                        <motion.div
                            className="hidden md:block"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{
                                delay: 0.6,
                                duration: 0.5,
                                ease: 'easeOut',
                            }}
                        >
                            <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
                        </motion.div>

                        {/* Right side - Welcome text and Login form */}
                        <div className="flex-1 p-6 md:p-8">
                            <motion.div
                                className="flex flex-col gap-8"
                                variants={cardVariants}
                            >
                                {/* Mobile logo and title */}
                                <motion.div
                                    className="flex flex-col items-center gap-4 md:hidden"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 150,
                                        damping: 15,
                                        delay: 0.3,
                                    }}
                                >
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
                                </motion.div>

                                {/* Welcome text for desktop */}
                                <motion.div
                                    className="hidden space-y-2 md:block"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                >
                                    <motion.h1
                                        className="text-3xl font-semibold text-gray-800 dark:text-neutral-100"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        Welcome back!
                                    </motion.h1>
                                    <motion.p
                                        className="text-lg text-gray-600 dark:text-neutral-100"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        Sign in to your account to continue.
                                    </motion.p>
                                </motion.div>

                                {/* Welcome text for mobile */}
                                <motion.div
                                    className="space-y-2 text-center md:hidden"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Welcome back!
                                    </h1>
                                    <p className="text-gray-600">
                                        Sign in to your account to continue.
                                    </p>
                                </motion.div>

                                {/* Form Content */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.9,
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                <Developers />
            </motion.div>
        </>
    );
}
