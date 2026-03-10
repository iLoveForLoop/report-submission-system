import { Media } from '@/types';

export interface ModalState {
    isOpen: boolean;
    item: Media | null;
    allItems: Media[];
    currentIndex: number;
}

export const SPREADSHEET_MIMES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'text/plain',
    'application/csv',
];

export function isSpreadsheet(mime: string, name: string) {
    if (SPREADSHEET_MIMES.includes(mime)) return true;
    const ext = name.split('.').pop()?.toLowerCase();
    return ['xlsx', 'xls', 'csv', 'tsv'].includes(ext ?? '');
}

export function isImage(mime: string) {
    return mime.startsWith('image/');
}

export function columnLabel(index: number) {
    let label = '';
    let i = index;
    do {
        label = String.fromCharCode(65 + (i % 26)) + label;
        i = Math.floor(i / 26) - 1;
    } while (i >= 0);
    return label;
}
