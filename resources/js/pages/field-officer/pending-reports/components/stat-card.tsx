import { Card, CardContent } from '@/components/ui/card';

const variants = {
    neutral: {
        label: 'text-muted-foreground dark:text-muted-foreground-dark',
        icon: 'text-muted-foreground dark:text-muted-foreground-dark',
        card: '',
        value: 'text-foreground dark:text-foreground-dark'
    },
    danger: {
        label: 'text-red-500 dark:text-red-400',
        icon: 'text-red-500 dark:text-red-400',
        card: 'border-red-500 bg-red-50 dark:bg-red-950/20',
        value: 'text-red-500 dark:text-white'
    },
    warning: {
        label: 'text-amber-500 dark:text-amber-400',
        icon: 'text-amber-600 dark:text-amber-400',
        card: 'border-amber-500 bg-amber-50 dark:bg-amber-950/20',
        value: 'text-amber-500 dark:text-white'
    },
};

export default function StatCard({
    label,
    value,
    icon: Icon,
    variant = 'neutral',
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    variant?: 'neutral' | 'danger' | 'warning';
}) {
    const style = variants[variant];

    return (
        <Card className={`gap-3 py-3 shadow-none bg-card-elevated border border-border  ${style.card}`}>
            <CardContent className="px-3">
                <div className="flex items-center justify-between">
                    <span className={`text-xs ${style.label}`}>
                        {label}
                    </span>
                    <Icon className={`h-4 w-4 ${style.icon}`} />
                </div>
                <p className={`mt-2 text-2xl font-semibold ${style.value}`}>
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}
