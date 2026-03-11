import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';
import DILGLogo from '../../images/dilg-main-logo.png';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({
    variant = 'header',
    children,
    ...props
}: AppContentProps) {
    const watermark = (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden"
        >
            <img
                src={DILGLogo}
                alt=""
                className="h-[900px] w-[800px] select-none object-contain opacity-[0.02] dark:opacity-[0.03]"
                draggable={false}
            />
        </div>
    );

    if (variant === 'sidebar') {
        return (
            <SidebarInset className="relative" {...props}>
                {watermark}
                <div className="relative  flex h-full flex-col">
                    {children}
                </div>
            </SidebarInset>
        );
    }

    return (
        <main
            className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl"
            {...props}
        >
            {watermark}
            <div className="relative z-10 flex h-full flex-col gap-4">
                {children}
            </div>
        </main>
    );
}
