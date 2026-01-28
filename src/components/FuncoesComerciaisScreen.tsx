import React, { useState } from 'react';
import { Plus, Search, Save, X, Edit, Trash2, CheckCircle2, Ban, ChevronRight, Loader2 } from 'lucide-react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { api } from '../services/api';

interface FuncaoComercial {
    id: number | string;
    nome: string;
    ativo: boolean;
    superiorId?: number | string | null;
}

export function FuncoesComerciaisScreen() {
    const [items, setItems] = useState<FuncaoComercial[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<FuncaoComercial | null>(null);
    const [loading, setLoading] = useState(false);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await api.get('/funcoes-comerciais', {
                params: { empresaId: '6731f1ea-20b7-4683-9401-41d3963bb22f' } // ID fixo temporário ou pegar do contexto
            });
            setItems(response.data);
        } catch (error) {
            console.error('Erro ao carregar funções:', error);
            alert('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadItems();
    }, []);

    const filteredItems = items.filter(i => i.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSave = async () => {
        if (!editingItem?.nome) return alert('Nome é obrigatório');

        // Prevent circular dependency (simple check: cannot be own superior)
        if (editingItem.id && editingItem.superiorId === editingItem.id) {
            return alert('Uma função não pode ser subordinada a si mesma.');
        }

        try {
            const payload = {
                empresaId: '6731f1ea-20b7-4683-9401-41d3963bb22f',
                nome: editingItem.nome,
                superiorId: editingItem.superiorId ? String(editingItem.superiorId) : null,
                ativo: editingItem.ativo
            };

            if (editingItem.id && typeof editingItem.id === 'string') {
                await api.patch(`/funcoes-comerciais/${editingItem.id}`, payload);
            } else {
                await api.post('/funcoes-comerciais', payload);
            }

            await loadItems();
            setIsEditing(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar dados.');
        }
    };

    const handleDelete = async (id: number | string) => {
        if (window.confirm('Excluir este item?')) {
            try {
                await api.delete(`/funcoes-comerciais/${id}`);
                await loadItems();
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir item.');
            }
        }
    };

    const getSuperiorName = (id?: number | string | null) => {
        if (!id) return '-';
        return items.find(i => i.id == id)?.nome || 'Não encontrado';
    };

    return (
        <LayoutWrapper title="Função Comercial" subtitle="Gerencie a hierarquia do time comercial">
            <div className="flex flex-col gap-6">

                {!isEditing ? (
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/30"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <ModernButton onClick={() => {
                                setEditingItem({ id: 0, nome: '', ativo: true, superiorId: null });
                                setIsEditing(true);
                            }}>
                                <Plus size={20} />
                                Novo Cadastro
                            </ModernButton>
                        </div>

                        <div className="relative overflow-x-auto rounded-xl border border-white/5">
                            <table className="w-full text-left text-sm text-blue-100">
                                <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
                                    <tr>
                                        <th className="px-6 py-4">Nome da Função</th>
                                        <th className="px-6 py-4">Superior Imediato</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={4} className="p-4 text-center">Carregando...</td></tr>
                                    ) : filteredItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{item.nome}</td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                {item.superiorId ? (
                                                    <>
                                                        <span className="opacity-50 text-xs">Reporta a</span>
                                                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-xs border border-indigo-500/30">
                                                            {getSuperiorName(item.superiorId)}
                                                        </span>
                                                    </>
                                                ) : <span className="text-white/30">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.ativo ?
                                                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-xs border border-emerald-400/20"><CheckCircle2 size={12} /> Ativo</span> :
                                                    <span className="inline-flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded-full text-xs border border-red-400/20"><Ban size={12} /> Inativo</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => { setEditingItem(item); setIsEditing(true); }} className="p-2 hover:bg-white/10 rounded-lg text-blue-300 transition-colors"><Edit size={16} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && filteredItems.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                                                Nenhum registro encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                ) : (
                    <GlassCard className="max-w-2xl mx-auto w-full p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                {editingItem?.id ? <Edit size={20} className="text-indigo-400" /> : <Plus size={20} className="text-emerald-400" />}
                                {editingItem?.id ? 'Editar Função' : 'Nova Função'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors"><X size={20} /></button>
                        </div>

                        <div className="space-y-6">
                            <ModernInput
                                label="Nome da Função"
                                value={editingItem?.nome || ''}
                                onChange={e => setEditingItem({ ...editingItem!, nome: e.target.value })}
                                placeholder="Ex: Vendedor, Supervisor..."
                            />

                            <div className="space-y-2">
                                <label className="text-sm text-blue-200 ml-1 font-medium">Superior Imediato</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-[#1e293b]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                                        value={editingItem?.superiorId || ''}
                                        onChange={e => setEditingItem({ ...editingItem!, superiorId: e.target.value ? Number(e.target.value) : null })}
                                    >
                                        <option value="">(Nenhum - Cargo de Topo)</option>
                                        {items
                                            .filter(i => i.id !== editingItem?.id) // Cannot be own superior
                                            .map(i => (
                                                <option key={i.id} value={i.id} className="bg-slate-800">
                                                    {i.nome}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/40 pointer-events-none" size={16} />
                                </div>
                                <p className="text-xs text-white/40 ml-1">Quem ocupa este cargo responde a quem?</p>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <div
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${editingItem?.ativo ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    onClick={() => setEditingItem({ ...editingItem!, ativo: !editingItem?.ativo })}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${editingItem?.ativo ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className={editingItem?.ativo ? "text-white" : "text-white/50"}>{editingItem?.ativo ? 'Cadastro Ativo' : 'Cadastro Inativo'}</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
                                <ModernButton variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</ModernButton>
                                <ModernButton variant="primary" onClick={handleSave}>
                                    <Save size={18} />
                                    Salvar Alterações
                                </ModernButton>
                            </div>
                        </div>
                    </GlassCard>
                )}
            </div>
        </LayoutWrapper>
    );
}
