import React from 'react';
import { cn } from '@/utils/cn';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function ModernInput({ className, label, error, icon, id, ...props }: ModernInputProps) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-blue-100 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    className={cn(
                        "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30",
                        icon && "pl-10",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/10",
                        "transition-all duration-300",
                        error && "border-red-400/50 focus:ring-red-500/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-red-300 text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
}
