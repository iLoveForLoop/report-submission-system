// resources/js/hooks/use-auth-polling.ts
import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export function useAuthPolling(intervalMs = 30000) {
    const { auth } = usePage().props;

    useEffect(() => {
        const interval = setInterval(() => {
            if (auth?.user) {
                router.reload({
                    only: ['auth'],
                    preserveState: true,
                });
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [auth, intervalMs]);
}
