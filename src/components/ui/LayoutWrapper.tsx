import React from 'react';
import { cn } from '@/utils/cn';
import { Factory } from 'lucide-react';

interface LayoutWrapperProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    onBack?: () => void;
    hideHeader?: boolean;
    noPadding?: boolean;
    embedded?: boolean;
}

export function LayoutWrapper({ children, className, title, subtitle, onBack, hideHeader, noPadding, embedded }: LayoutWrapperProps) {
    if (embedded) {
        return (
            <div className={cn("flex flex-col h-full w-full overflow-hidden", className)}>
                {/* Embedded Header */}
                {!hideHeader && (title || onBack) && (
                    <div className="flex justify-between items-center mb-6 shrink-0 p-1">
                        <div>
                            {title && <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>}
                            {subtitle && <p className="text-sm text-blue-200/60">{subtitle}</p>}
                        </div>
                        {onBack && (
                            <button onClick={onBack} className="text-white/70 hover:text-white">Back</button>
                        )}
                    </div>
                )}
                {/* Content */}
                <div className={cn("flex-1 overflow-y-auto custom-scrollbar", !noPadding && "pr-2")}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center p-4">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3270&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-purple-900/40 mix-blend-multiply"></div>
            </div>

            {/* Floating Glass Container */}
            <div className={cn(
                "relative z-10 w-full max-w-[1400px] h-[90vh] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden flex flex-col",
                className
            )}>

                {/* Header (Opcional, se title for passado e não estiver oculto) */}
                {!hideHeader && (title || onBack) && (
                    <header className="flex flex-col md:flex-row justify-between items-center p-8 pb-4 text-white gap-4 flex-shrink-0">
                        <div className="flex items-center gap-4">
                            {onBack && (
                                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white">
                                    {'< Voltar'}
                                </button>
                            )}
                            {title && (
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm font-display text-white">{title}</h1>
                                    {subtitle && <p className="text-blue-100 font-light opacity-80 text-sm tracking-wide">{subtitle}</p>}
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {/* Content Area */}
                <div className={cn("flex-1 overflow-auto custom-scrollbar", !noPadding && "p-4 md:p-8")}>
                    {children}
                </div>
            </div>
        </div>
    );
}
