import React from 'react';
import { cn } from '@/utils/cn';
import { LucideIcon } from 'lucide-react';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    icon?: LucideIcon;
    isLoading?: boolean;
}

export function ModernButton({
    children,
    variant = 'primary',
    className,
    icon: Icon,
    isLoading,
    disabled,
    ...props
}: ModernButtonProps) {

    const variants = {
        primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 border-none",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm",
        danger: "bg-red-500/80 hover:bg-red-600/90 text-white border border-red-400/30 shadow-lg shadow-red-500/20",
        ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white border-none shadow-none",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/5"
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={cn(
                "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : Icon ? (
                <Icon size={20} className={children ? "mr-1" : ""} />
            ) : null}

            {children}
        </button>
    );
}
