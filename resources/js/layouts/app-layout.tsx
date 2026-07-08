import { FlashToaster } from '@/components/flash-toaster';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    // useAuthPolling(5000);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <FlashToaster />
            {children}
        </AppLayoutTemplate>
    );
};
