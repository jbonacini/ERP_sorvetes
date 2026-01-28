import React, { useState } from 'react';
import { Plus, Search, Save, X, Edit, Trash2, CheckCircle2, Ban } from 'lucide-react';
import { LayoutWrapper } from './ui/LayoutWrapper'; // Usando o LayoutWrapper mas vamos sobrescrever o content para caber no layout do módulo
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';

interface GenericEntityScreenProps {
    title: string;
    description?: string;
    entityName?: string; // Singular, ex: "Cidade"
}

// Mock Data Store (Volatile) - In a real app this would fetch from API based on entityName
const mockStore: Record<string, any[]> = {};

export function GenericEntityScreen({ title, description, entityName = "Item" }: GenericEntityScreenProps) {
    // Generate a consistent key for this entity
    const storeKey = title.toUpperCase().replace(/\s/g, '_');

    // Initialize store if needed
    if (!mockStore[storeKey]) {
        mockStore[storeKey] = [
            { id: 1, nome: `Exemplo ${entityName} 01`, ativo: true },
            { id: 2, nome: `Exemplo ${entityName} 02`, ativo: false },
        ];
    }

    const [items, setItems] = useState<any[]>(mockStore[storeKey]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const filteredItems = items.filter(i => i.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = () => {
        if (!editingItem?.nome) return alert('Nome é obrigatório');

        let newItems = [...items];
        if (editingItem.id) {
            // Edit
            newItems = newItems.map(i => i.id === editingItem.id ? editingItem : i);
        } else {
            // Create
            newItems.push({ ...editingItem, id: Date.now() });
        }

        mockStore[storeKey] = newItems;
        setItems(newItems);
        setIsEditing(false);
        setEditingItem(null);
    };

    const handleDelete = (id: number) => {
        if (confirm('Deseja excluir este item?')) {
            const newItems = items.filter(i => i.id !== id);
            mockStore[storeKey] = newItems;
            setItems(newItems);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 w-full">
            {/* Header Manual para alinhar com o Sidebar se estiverem lado a lado, ou usar LayoutWrapper com props de disable se for o caso.
                Na verdade, como o Sidebar vai estar *fora*, este componente vai ocupar a área de "content" à direita.
             */}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-blue-200/60">{description || `Gestão de ${title.toLowerCase()}`}</p>
                </div>
                <div className="flex gap-4">
                    <ModernInput
                        placeholder={`Buscar ${entityName}...`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        icon={<Search size={18} />}
                        className="w-64"
                    />
                    <ModernButton onClick={() => { setEditingItem({ nome: '', ativo: true }); setIsEditing(true); }} icon={Plus}>
                        Novo {entityName}
                    </ModernButton>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                <GlassCard className="h-full flex flex-col p-0">
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left text-white/90">
                            <thead className="bg-white/10 sticky top-0 backdrop-blur-md z-10 text-xs uppercase text-blue-100/70 font-bold border-b border-white/10">
                                <tr>
                                    <th className="p-4 pl-6">Nome / Descrição</th>
                                    <th className="p-4 w-32 text-center">Status</th>
                                    <th className="p-4 w-32 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6 font-medium text-white">{item.nome}</td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.ativo ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                                {item.ativo ? 'ATIVO' : 'INATIVO'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingItem(item); setIsEditing(true); }} className="p-2 hover:bg-white/10 rounded-lg text-blue-300 hover:text-white transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-white transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-white/30 italic">
                                            Nenhum registro encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>

            {/* Modal de Edição */}
            {isEditing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <GlassCard className="w-full max-w-md p-6 border-indigo-500/30 shadow-indigo-500/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editingItem?.id ? `Editar ${entityName}` : `Novo ${entityName}`}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <ModernInput
                                label="Nome"
                                value={editingItem.nome}
                                onChange={e => setEditingItem({ ...editingItem, nome: e.target.value })}
                                autoFocus
                            />

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mt-4 cursor-pointer" onClick={() => setEditingItem({ ...editingItem, ativo: !editingItem.ativo })}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editingItem.ativo ? 'bg-indigo-600 border-indigo-500' : 'border-white/30 bg-white/5'}`}>
                                    {editingItem.ativo && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <span className="text-white text-sm font-medium select-none">Registro Ativo</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <ModernButton variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</ModernButton>
                            <ModernButton onClick={handleSave} icon={Save}>Salvar</ModernButton>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
