import Developers from '@/components/developers/developers';
import Header from '@/components/header/header';
import { login } from '@/routes';
// import { type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
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

// ── Radar Scanner ─────────────────────────────────────────────────────────────

function RadarScanner({ size = 420 }: { size?: number }) {
    const r = size / 2;

    return (
        <div
            className="pointer-events-none absolute"
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute inset-0"
            >
                {[0.25, 0.5, 0.75, 1].map((scale) => (
                    <circle
                        key={scale}
                        cx={r}
                        cy={r}
                        r={r * scale - 1}
                        fill="none"
                        stroke="rgba(100,100,100,0.2)"
                        strokeWidth="1"
                    />
                ))}
                <line
                    x1={r}
                    y1={0}
                    x2={r}
                    y2={size}
                    stroke="rgba(100,100,100,0.15)"
                    strokeWidth="1"
                />
                <line
                    x1={0}
                    y1={r}
                    x2={size}
                    y2={r}
                    stroke="rgba(100,100,100,0.15)"
                    strokeWidth="1"
                />
                {[45, 135, 225, 315].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                        <line
                            key={angle}
                            x1={r + Math.cos(rad) * (r * 0.9)}
                            y1={r + Math.sin(rad) * (r * 0.9)}
                            x2={r + Math.cos(rad) * r}
                            y2={r + Math.sin(rad) * r}
                            stroke="rgba(100,100,100,0.25)"
                            strokeWidth="1.5"
                        />
                    );
                })}
            </svg>

            <motion.div
                className="absolute inset-0 overflow-hidden rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
                <div
                    className="h-full w-full"
                    style={{
                        background: `conic-gradient(
                            from 0deg at 50% 50%,
                            transparent               0deg,
                            transparent               220deg,
                            rgba(150,150,150,0.02)    260deg,
                            rgba(150,150,150,0.07)    310deg,
                            rgba(180,180,180,0.15)    350deg,
                            rgba(200,200,200,0.22)    360deg
                        )`,
                    }}
                />
            </motion.div>

            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <line
                        x1={r}
                        y1={r}
                        x2={r}
                        y2={2}
                        stroke="rgba(180,180,180,0.5)"
                        strokeWidth="1.5"
                    />
                </svg>
            </motion.div>

            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="absolute inset-0"
            >
                <circle
                    cx={r}
                    cy={r}
                    r={r - 1}
                    fill="none"
                    stroke="rgba(100,100,100,0.3)"
                    strokeWidth="1.5"
                />
            </svg>
        </div>
    );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ label }: { label: string }) {
    return (
        <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-slate-100 px-3 py-1.5 dark:border-slate-600 dark:bg-slate-800/60">
            <motion.div
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                variants={pulseDotVariants}
                animate="animate"
            />
            <span className="font-mono text-[11px] font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                {label}
            </span>
        </div>
    );
}

// ── Info Pill ─────────────────────────────────────────────────────────────────

// function InfoPill({ icon, label }: { icon: string; label: string }) {
//     return (
//         <div className="flex items-center gap-2 rounded-sm border border-slate-200 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
//             <span className="text-sm">{icon}</span>
//             <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
//                 {label}
//             </span>
//         </div>
//     );
// }

// ── Component ─────────────────────────────────────────────────────────────────

export default function Welcome({
    department = 'DILG Region VII — Bohol',
    headline = 'Report Submission System',
    description = 'A centralized platform for the submission, tracking, and management of DTRs and official reports across DILG field operations in Region VII.',
}: {
    canRegister?: boolean;
    department?: string;
    headline?: string;
    subtitle?: string;
    description?: string;
}) {
    return (
        <>
            <motion.main
                className="landing-page relative min-h-screen"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Header />

                <div className="flex items-center justify-center py-8 sm:py-12 md:h-[85vh] md:py-0">
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20">
                        <div className="flex flex-col items-center justify-between gap-12 md:flex-row md:gap-0">
                            {/* LEFT — Headline */}
                            <div className="order-2 w-full md:order-1 md:w-1/2">
                                {/* System status badge */}
                                <StatusBadge label={department} />

                                {/* Eyebrow label */}
                                <p className="mb-2 font-mono text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase dark:text-slate-500">
                                    Official Government System
                                </p>

                                {/* Main headline */}
                                <motion.h1
                                    className="text-3xl leading-[1.1] font-black tracking-tight text-slate-800 sm:text-4xl md:text-5xl lg:text-7xl dark:text-slate-100"
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
                                </motion.h1>

                                {/* Accent rule */}
                                <motion.div
                                    className="my-4 h-[2px] w-16 bg-slate-300 dark:bg-slate-600"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    style={{ originX: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                />

                                {/* Description */}
                                {/* <motion.p
                                    className="max-w-md text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                >
                                    {description}
                                </motion.p> */}

                                {/* CTA */}
                                <motion.div
                                    className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.75, duration: 0.5 }}
                                >
                                    <Link
                                        href={login()}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-slate-800 px-7 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-700 md:w-auto dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                                    >
                                        Login
                                        <motion.img
                                            src="/Icons/sign-in-fill.svg"
                                            alt="Login Icon"
                                            className="h-4 dark:invert"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    </Link>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                        Authorized personnel only
                                    </span>
                                </motion.div>
                            </div>

                            {/* RIGHT — Logo with Radar */}
                            <motion.div
                                className="order-1 flex w-full justify-center md:order-2 md:w-1/2"
                                variants={logoVariants}
                            >
                                <div
                                    className="relative flex items-center justify-center"
                                    style={{ width: 420, height: 420 }}
                                >
                                    {/* Radar scanner */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <RadarScanner size={500} />
                                    </div>

                                    {/* Subtle glow behind logo */}
                                    <div className="absolute h-48 w-48 rounded-full bg-slate-200/40 blur-2xl dark:bg-slate-700/30" />

                                    {/* Logo */}
                                    <img
                                        src="/Logo/DILG-logo.png"
                                        alt="DILG Logo"
                                        className="relative z-10 h-auto max-h-[200px] w-auto drop-shadow-md sm:max-h-[400px] md:max-h-[400px]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <Developers />
            </motion.main>

            <div className="bg" />
            <div className="bg bg2" />
            <div className="bg bg3" />
        </>
    );
}
