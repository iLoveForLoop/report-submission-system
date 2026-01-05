import type { UrlMethodPair } from '@inertiajs/core';
import { Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';

interface Props {
    link: UrlMethodPair;
}
export default function Back({ link }: Props) {
    return (
        <Link href={link}>
            <div className="flex items-center gap-1">
                <ArrowLeftIcon size={20} />
                <span> Back</span>
            </div>
        </Link>
    );
}
