import { Button } from '@/components/ui/button';
import { Media } from '@/types';
import { AlertCircle, Download, Loader2, Table } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { columnLabel } from './file-preview-types';

interface Props {
    item: Media;
}

export function SpreadsheetPreview({ item }: Props) {
    const [sheets, setSheets] = useState<Record<string, string[][]>>({});
    const [activeSheet, setActiveSheet] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setSheets({});
        setActiveSheet('');

        fetch(item.original_url)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.arrayBuffer();
            })
            .then((buf) => {
                if (cancelled) return;
                const wb = XLSX.read(buf, { type: 'array' });
                const parsed: Record<string, string[][]> = {};
                wb.SheetNames.forEach((name) => {
                    const ws = wb.Sheets[name];
                    parsed[name] = XLSX.utils.sheet_to_json(ws, {
                        header: 1,
                        defval: '',
                    }) as string[][];
                });
                setSheets(parsed);
                setActiveSheet(wb.SheetNames[0]);
            })
            .catch((e) => {
                if (!cancelled) setError(e.message ?? 'Failed to load file');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [item.original_url]);

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Parsing spreadsheet…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 text-destructive">
                <AlertCircle className="h-8 w-8" />
                <p className="text-sm font-medium">Could not load file</p>
                <p className="text-xs text-muted-foreground">{error}</p>
                <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="mt-1 gap-2"
                >
                    <a href={item.original_url} download={item.name}>
                        <Download className="h-3.5 w-3.5" /> Download instead
                    </a>
                </Button>
            </div>
        );
    }

    const sheetNames = Object.keys(sheets);
    const rows = sheets[activeSheet] ?? [];
    const [header, ...dataRows] = rows.length > 0 ? rows : [[], []];
    const colCount = Math.max(...rows.map((r) => r.length), 0);

    return (
        <div className="flex h-full w-full flex-col gap-2">
            {/* Sheet tabs */}
            {sheetNames.length > 1 && (
                <div className="flex shrink-0 gap-1 overflow-x-auto px-1">
                    {sheetNames.map((name) => (
                        <button
                            key={name}
                            onClick={() => setActiveSheet(name)}
                            className={`flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                                activeSheet === name
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Table className="h-3 w-3" />
                            {name}
                        </button>
                    ))}
                </div>
            )}

            {/* Table */}
            {rows.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    This sheet is empty.
                </div>
            ) : (
                <div className="flex-1 overflow-auto rounded-md border bg-background">
                    <table className="min-w-full text-xs">
                        <thead className="sticky top-0 z-10 bg-muted">
                            <tr>
                                <th className="w-8 border-r border-b px-2 py-1.5 text-center font-medium text-muted-foreground select-none">
                                    #
                                </th>
                                {Array.from({ length: colCount }).map(
                                    (_, ci) => (
                                        <th
                                            key={ci}
                                            className="border-r border-b px-3 py-1.5 text-left font-semibold whitespace-nowrap last:border-r-0"
                                        >
                                            {header[ci] !== undefined &&
                                            header[ci] !== '' ? (
                                                String(header[ci])
                                            ) : (
                                                <span className="text-muted-foreground/40">
                                                    {columnLabel(ci)}
                                                </span>
                                            )}
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {dataRows.map((row, ri) => (
                                <tr
                                    key={ri}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <td className="w-8 border-r border-b px-2 py-1 text-center text-muted-foreground/50 select-none">
                                        {ri + 1}
                                    </td>
                                    {Array.from({ length: colCount }).map(
                                        (_, ci) => (
                                            <td
                                                key={ci}
                                                className="max-w-[200px] truncate border-r border-b px-3 py-1 whitespace-nowrap last:border-r-0"
                                                title={String(row[ci] ?? '')}
                                            >
                                                {row[ci] !== undefined &&
                                                row[ci] !== '' ? (
                                                    String(row[ci])
                                                ) : (
                                                    <span className="text-muted-foreground/30">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        ),
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="shrink-0 px-1 text-right text-[10px] text-muted-foreground">
                {dataRows.length} row{dataRows.length !== 1 ? 's' : ''} ·{' '}
                {colCount} column{colCount !== 1 ? 's' : ''}
            </p>
        </div>
    );
}
