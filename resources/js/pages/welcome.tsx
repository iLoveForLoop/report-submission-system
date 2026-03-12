import Developers from '@/components/developers/developers';
import Header from '@/components/header/header';
import { login } from '@/routes';
import TestHeader from '@/components/header/test-header';
// import { type SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
        },
    },
};

const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: 0.3,
        },
    },
};

const pulseDotVariants = {
    animate: {
        scale: [1, 1.5, 1],
        opacity: [1, 0.7, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// ── Radar Orbit ───────────────────────────────────────────────────────────────

function RadarOrbit({
    radius,
    duration,
    dotSize = 8,
    dotColor = '#3b82f6',
    ringOpacity = 0.15,
    delay = 0,
}: {
    radius: number;
    duration: number;
    dotSize?: number;
    dotColor?: string;
    ringOpacity?: number;
    delay?: number;
}) {
    return (
        <div
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{
                width: radius * 2,
                height: radius * 2,
                marginLeft: -radius,
                marginTop: -radius,
            }}
        >
            {/* Static ring */}
            <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: dotColor, opacity: ringOpacity }}
            />

            {/* Orbiting glowing dot */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: dotSize,
                    height: dotSize,
                    borderRadius: '50%',
                    background: dotColor,
                    boxShadow: `0 0 ${dotSize * 2}px ${dotColor}, 0 0 ${dotSize * 4}px ${dotColor}55`,
                    top: '50%',
                    left: '50%',
                    marginLeft: -dotSize / 2,
                    marginTop: -dotSize / 2,
                }}
                animate={{
                    x: [
                        radius,
                        radius * Math.cos(Math.PI / 2),
                        -radius,
                        -radius * Math.cos(Math.PI / 2),
                        radius,
                    ],
                    y: [
                        0,
                        -radius * Math.sin(Math.PI / 2),
                        0,
                        radius * Math.sin(Math.PI / 2),
                        0,
                    ],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay,
                }}
            />
        </div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Welcome({
    department = 'DILG Region VII - Bohol',
    headline = 'Report Submission System',
    description = 'A centralized system that enables efficient submission, tracking, and management of DTRs and official reports for DILG field operations.',
}: {
    canRegister?: boolean;
    department?: string;
    headline?: string;
    subtitle?: string;
    description?: string;
}) {
    // const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome"></Head>
            <motion.main
                className="landing-page relative min-h-screen"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Header />

                <motion.div
                    className="flex items-center justify-center py-8 sm:py-12 md:h-[85vh] md:py-0"
                    // variants={itemVariants}
                >
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-0">
                            {/* Headline and text - LEFT SIDE */}
                            <div className="order-2 w-full md:order-1 md:w-1/2">
                                <motion.div
                                    className=""
                                    // variants={itemVariants}
                                >
                                    {/* Changed from <p> to <div> to fix hydration error */}
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-500 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 sm:text-sm">
                                        <motion.div
                                            className="h-2 w-2 rounded-full bg-blue-500"
                                            variants={pulseDotVariants}
                                            animate="animate"
                                        ></motion.div>
                                        {department}
                                    </div>
                                    <motion.h4
                                        className="text-3xl leading-tight font-extrabold text-blue-600 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl dark:text-foreground"
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 100,
                                            damping: 20,
                                            delay: 0.2,
                                        }}
                                    >
                                        {headline}
                                    </motion.h4>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className="mt-2"
                                >
                                    <motion.p
                                        className="text-sm leading-relaxed text-gray-900 sm:text-base md:text-lg dark:text-gray-300"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.8,
                                        }}
                                    >
                                        {description}
                                    </motion.p>

                                    <motion.div className="mt-2">
                                        <Link
                                            href={login()}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-blue-500 px-6 py-3 text-sm text-white transition duration-200 ease-in-out hover:bg-blue-700 md:w-auto md:px-8 md:py-3 md:text-base"
                                        >
                                            Login
                                            <motion.img
                                                src="/Icons/sign-in-fill.svg"
                                                alt="Login Icon"
                                                className="h-4 md:h-5"
                                                animate={{ x: [0, 5, 0] }}
                                            />
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Logo - RIGHT SIDE */}
                            <motion.div
                                className="order-1 flex w-full justify-center md:order-2 md:w-1/2"
                                variants={logoVariants}
                            >
                                {/* Radar wrapper — all orbits centered on the logo */}
                                <div className="relative flex items-center justify-center">

                                    {/* Orbit 1 — inner, fast, blue */}
                                    <RadarOrbit radius={135} duration={6}  dotSize={8} dotColor="#3b82f6" ringOpacity={0.20} delay={0}   />
                                    {/* Orbit 2 — mid, medium speed, sky blue */}
                                    <RadarOrbit radius={175} duration={11} dotSize={6} dotColor="#38bdf8" ringOpacity={0.13} delay={1.5} />
                                    {/* Orbit 3 — outer, slow, indigo */}
                                    <RadarOrbit radius={215} duration={17} dotSize={5} dotColor="#6366f1" ringOpacity={0.08} delay={3.5} />

                                    {/* Logo sits on top of the orbits */}
                                    <img
                                        src="/Logo/DILG-logo.png"
                                        alt="DILG Logo"
                                        className="relative z-10 h-auto max-h-[200px] w-auto sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] xl:max-h-[400px]"
                                    />
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
                <Developers />
            </motion.main>

            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>
        </>
    );
}
