import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <Card className="gap-3 py-3 shadow-none">
            <CardContent className="px-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {label}
                    </span>
                    {icon}
                </div>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
            </CardContent>
        </Card>
    );
}
