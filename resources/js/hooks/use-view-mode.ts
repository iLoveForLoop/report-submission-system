import { useState } from 'react';

type ViewMode = 'grid' | 'list';

const STORAGE_KEY = 'view_mode';

export function useViewMode() {
    const [mode, setMode] = useState<ViewMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            return (saved as ViewMode) || 'grid';
        }
        return 'grid';
    });

    const updateMode = (newMode: ViewMode) => {
        setMode(newMode);
        localStorage.setItem(STORAGE_KEY, newMode);
    };

    return { mode, updateMode };
}
