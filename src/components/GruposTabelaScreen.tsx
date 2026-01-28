import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, ArrowLeft, FolderOpen, Edit, Check, X, Shield } from 'lucide-react';
import { tabelasPrecoService, db } from '../services/api';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';

interface GruposTabelaScreenProps {
    onBack?: () => void;
}

export function GruposTabelaScreen({ onBack }: GruposTabelaScreenProps) {
    const [grupos, setGrupos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        ativo: true
    });
    const [isEditing, setIsEditing] = useState(false);

    const empresaId = db.empresaAtual?.id || '';

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const data = await tabelasPrecoService.listarGrupos(empresaId);
            setGrupos(data);
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!formData.nome) return;
        try {
            if (isEditing && formData.id) {
                // Mock update if service doesn't have it explicitly
                await tabelasPrecoService.criarGrupo({ ...formData, empresaId });
            } else {
                await tabelasPrecoService.criarGrupo({ ...formData, empresaId });
            }
            handleCancel();
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }

    function handleEdit(grupo: any) {
        setFormData({
            id: grupo.id,
            nome: grupo.nome,
            ativo: grupo.ativo
        });
        setIsEditing(true);
        setShowForm(true);
    }

    function handleDelete(id: string) {
        if (confirm('Tem certeza que deseja remover este grupo?')) {
            alert('Funcionalidade de exclusão pendente no backend.');
        }
    }

    function handleCancel() {
        setShowForm(false);
        setIsEditing(false);
        setFormData({ id: '', nome: '', ativo: true });
    }

    return (
        <LayoutWrapper
            title="Grupos de Tabela de Preço"
            subtitle="Organize suas tabelas de preços em grupos"
            onBack={onBack}
        >
            {/* Toolbar */}
            <div className="flex justify-end mb-6">
                <ModernButton
                    onClick={() => setShowForm(true)}
                    icon={Plus}
                >
                    Novo Grupo
                </ModernButton>
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-8">
                    <GlassCard className="max-w-xl mx-auto border-indigo-500/20 shadow-indigo-500/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                {isEditing ? <Edit size={18} className="text-indigo-400" /> : <Plus size={18} className="text-indigo-400" />}
                                {isEditing ? 'Editar Grupo' : 'Novo Grupo'}
                            </h2>
                            <button onClick={handleCancel} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <ModernInput
                                label="Nome do Grupo"
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Ex: Varejo, Atacado"
                            />

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mt-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.ativo ? 'bg-indigo-600 border-indigo-500' : 'border-white/30 bg-white/5'}`}>
                                        {formData.ativo && <Check size={14} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.ativo}
                                        onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
                                        className="hidden"
                                    />
                                    <span className="text-white text-sm font-medium">Grupo Ativo</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                            <ModernButton variant="ghost" onClick={handleCancel}>Cancelar</ModernButton>
                            <ModernButton onClick={handleSave} icon={Save}>Salvar</ModernButton>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Grid de Grupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grupos.map(g => (
                    <GlassCard key={g.id} className="flex justify-between items-center group hover:bg-white/10 cursor-pointer transition-colors border-white/10 hover:border-indigo-500/30">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform">
                                <FolderOpen className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white group-hover:text-indigo-200 transition-colors">{g.nome}</h3>
                                <div className="text-xs text-blue-200/60 flex items-center gap-2 mt-1">
                                    <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${g.ativo ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                                        <div className={`w-1 h-1 rounded-full ${g.ativo ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                        {g.ativo ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(g); }} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-indigo-300 transition-colors">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(g.id); }} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </GlassCard>
                ))}

                {/* Empty State */}
                {grupos.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center text-white/40">
                        <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Nenhum grupo de tabela cadastrado.</p>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    );
}
