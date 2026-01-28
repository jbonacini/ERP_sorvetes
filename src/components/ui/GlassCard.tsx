import React from 'react';
import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl",
                hoverEffect && "hover:bg-white/10 transition-colors duration-300",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
