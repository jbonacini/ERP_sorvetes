import { useState } from 'react';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { MenuItem } from '../../config/operationalMenu';
import { cn } from '../../utils/cn';

interface GlassSidebarProps {
    items: MenuItem[];
    activeItem: string;
    onSelect: (item: MenuItem) => void;
    onBack?: () => void;
    logoTitle?: string;
    logoSubtitle?: string;
    logoUrl?: string;
}

export function GlassSidebar({
    items,
    activeItem,
    onSelect,
    onBack,
    logoTitle = "Empresa",
    logoSubtitle = "Gestão Integrada",
    logoUrl,
    className
}: GlassSidebarProps & { className?: string }) {
    // Estado para controlar quais categorias estão abertas (Accordion)
    // Inicializa com a categoria do item ativo aberta, se houver
    const [openCategories, setOpenCategories] = useState<string[]>(() => {
        const parent = items.find(cat => cat.children?.some(child => child.id === activeItem));
        return parent ? [parent.id] : [];
    });

    const toggleCategory = (id: string) => {
        setOpenCategories(prev =>
            prev.includes(id) ? [] : [id]
        );
    };

    return (
        <div className={cn("w-72 h-full flex flex-col bg-slate-900/80 backdrop-blur-xl border-r border-white/10 text-white rounded-l-[40px] shadow-2xl overflow-hidden shrink-0", className)}>
            {/* Header */}
            <div className="p-8 border-b border-white/10 relative">
                <div className="flex items-center gap-3">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-lg bg-white/10" />
                    ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shrink-0">
                            <span className="font-bold text-lg">{logoTitle.substring(0, 2).toUpperCase()}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="font-bold text-lg leading-tight truncate w-40">{logoTitle}</h1>
                        <p className="text-xs text-blue-200/70 truncate w-40">{logoSubtitle}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {items.map(category => {
                    const isOpen = openCategories.includes(category.id);
                    const isActiveParent = category.children?.some(child => child.id === activeItem);
                    const Icon = category.icon;
                    const hasChildren = category.children && category.children.length > 0;
                    const isActive = activeItem === category.id;

                    if (!hasChildren) {
                        return (
                            <button
                                key={category.id}
                                onClick={() => onSelect(category)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 mb-2",
                                    isActive ? "bg-indigo-600/20 text-indigo-200 shadow-lg shadow-indigo-500/10" : "hover:bg-white/5 text-slate-300 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {Icon && <Icon size={20} className={isActive ? "text-indigo-400" : "opacity-70"} />}
                                    <span className="font-medium text-sm">{category.label}</span>
                                </div>
                            </button>
                        );
                    }

                    return (
                        <div key={category.id} className="rounded-xl overflow-hidden mb-2">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300",
                                    isActiveParent ? "bg-indigo-600/20 text-indigo-200" : "hover:bg-white/5 text-slate-300 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {Icon && <Icon size={20} className={isActiveParent ? "text-indigo-400" : "opacity-70"} />}
                                    <span className="font-medium text-sm">{category.label}</span>
                                </div>
                                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {/* Submenu Items */}
                            <div className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out pl-4",
                                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="pl-4 border-l border-white/10 my-1 space-y-1">
                                    {category.children?.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => onSelect(child)}
                                            className={cn(
                                                "w-full text-left py-2 px-3 text-sm rounded-lg transition-colors",
                                                activeItem === child.id
                                                    ? "bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {child.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Back Button */}
            {onBack && (
                <div className="p-4 border-t border-white/10 bg-black/20">
                    <button
                        onClick={onBack}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-200 transition-colors text-slate-400 text-sm font-medium border border-white/5"
                    >
                        <LogOut size={16} />
                        Sair do Módulo
                    </button>
                </div>
            )}
        </div>
    );
}
