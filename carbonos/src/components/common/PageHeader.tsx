import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string;
    badge?: React.ReactNode;
}

export function PageHeader({ title, description, badge, children, className }: PageHeaderProps) {
    return (
        <header className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    {title}
                    {badge}
                </h1>
                {description && (
                    <p className="text-slate-400 mt-2 text-sm md:text-base">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </header>
    );
}
