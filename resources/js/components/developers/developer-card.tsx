// components/DeveloperCard.tsx
import { Github } from 'lucide-react';
import { Developer } from '../../components/types';

interface DeveloperCardProps {
    developer: Developer;
}

const DeveloperCard = ({ developer }: DeveloperCardProps) => {
    return (
        <a
            href={developer.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-lg border border-border bg-card p-2 transition-all hover:border-primary/25 hover:bg-primary/5 hover:shadow-sm"
        >
            {/* Developer Avatar */}
            <div className="relative shrink-0">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-card bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm transition-transform group-hover:scale-105">
                    {developer.image ? (
                        <img
                            src={developer.image}
                            alt={developer.name}
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>
                <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border border-card bg-primary/10" />
            </div>

            {/* Developer Info */}
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground transition-colors group-hover:text-primary">
                    {developer.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                    {developer.email}
                </p>
            </div>

            {/* GitHub Icon */}
            <Github className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </a>
    );
};

export default DeveloperCard;
