import React, { useState, useEffect } from 'react';
import { dbService, PerfilAcesso } from '../services/api';
import { MODULOS } from '@/types';
import { Trash2, Edit, Plus, Save, X, Network } from 'lucide-react';
import { gsap } from 'gsap';

export function PerfisScreen() {
    const [perfis, setPerfis] = useState<PerfilAcesso[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPerfil, setEditingPerfil] = useState<Partial<PerfilAcesso> | null>(null);

    useEffect(() => {
        carregarPerfis();
    }, []);

    useEffect(() => {
        if (editingPerfil) {
            gsap.from(".modal-content", { y: -50, opacity: 0, duration: 0.3 });
        }
    }, [editingPerfil]);

    const carregarPerfis = async () => {
        setLoading(true);
        try {
            const dados = await dbService.adminService.listarPerfis();
            setPerfis(dados);
        } catch (error) {
            console.error('Erro ao carregar perfis', error);
            alert('Erro ao carregar perfis');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingPerfil?.nome) return alert('Nome é obrigatório');

        try {
            if (editingPerfil.id) {
                // Update logic not implemented in service yet for frontend call? 
                // Assuming creating new for now or need to add update method to api.ts if missing.
                // Let's assume creating a new one for simplicity if ID is missing or Update if present.
                // Actually api.ts only shows criarPerfil. I should verify if I added atualizarPerfil.
                // Checking api.ts... I only see criarPerfil. I might need to add update.
                // For now let's just support create.
                alert('Edição não implementada no frontend ainda, apenas criação.');
                return;
            }

            await dbService.adminService.criarPerfil(editingPerfil as any);
            setEditingPerfil(null);
            carregarPerfis();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar perfil');
        }
    };

    const togglePermissao = (modulo: string, tipo: 'criar' | 'ler' | 'atualizar' | 'deletar' | 'aprovar') => {
        if (!editingPerfil) return;

        const permissoes = [...(editingPerfil.permissoes || [])];
        const permIndex = permissoes.findIndex(p => p.modulo === modulo);

        if (permIndex >= 0) {
            permissoes[permIndex] = {
                ...permissoes[permIndex],
                [tipo]: !permissoes[permIndex][tipo]
            };
        } else {
            permissoes.push({
                modulo,
                criar: false, ler: false, atualizar: false, deletar: false, aprovar: false,
                [tipo]: true
            });
        }
        setEditingPerfil({ ...editingPerfil, permissoes });
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Network className="w-8 h-8 text-indigo-600" />
                        Perfis de Acesso
                    </h1>
                    <p className="text-slate-500">Gerencie as permissões de acesso dos usuários</p>
                </div>
                <button
                    onClick={() => setEditingPerfil({ nome: '', permissoes: [] })}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    Novo Perfil
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {perfis.map(perfil => (
                        <div key={perfil.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{perfil.nome}</h3>
                                    <p className="text-sm text-slate-500">{perfil.descricao || 'Sem descrição'}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* <button className="text-slate-400 hover:text-indigo-600"><Edit size={18} /></button> */}
                                    {/* <button className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button> */}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {perfil.permissoes.slice(0, 3).map((p, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">
                                        {p.modulo}
                                    </span>
                                ))}
                                {perfil.permissoes.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">
                                        +{perfil.permissoes.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Edição */}
            {editingPerfil && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-content">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingPerfil.id ? 'Editar Perfil' : 'Novo Perfil'}
                            </h2>
                            <button
                                onClick={() => setEditingPerfil(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Perfil</label>
                                    <input
                                        type="text"
                                        value={editingPerfil.nome || ''}
                                        onChange={e => setEditingPerfil({ ...editingPerfil, nome: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ex: Gerente de Vendas"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                                    <input
                                        type="text"
                                        value={editingPerfil.descricao || ''}
                                        onChange={e => setEditingPerfil({ ...editingPerfil, descricao: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Breve descrição das responsabilidades"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-800 mb-4">Permissões por Módulo</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[600px]">
                                        <thead>
                                            <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase">
                                                <th className="px-4 py-3">Módulo</th>
                                                <th className="px-4 py-3 text-center">Ler</th>
                                                <th className="px-4 py-3 text-center">Criar</th>
                                                <th className="px-4 py-3 text-center">Editar</th>
                                                <th className="px-4 py-3 text-center">Excluir</th>
                                                <th className="px-4 py-3 text-center">Aprovar</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {MODULOS.map(modulo => {
                                                const perm = editingPerfil.permissoes?.find(p => p.modulo === modulo) || { modulo, ler: false, criar: false, atualizar: false, deletar: false, aprovar: false };
                                                return (
                                                    <tr key={modulo} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 font-medium text-slate-700">{modulo}</td>
                                                        {(['ler', 'criar', 'atualizar', 'deletar', 'aprovar'] as const).map(acao => (
                                                            <td key={acao} className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!perm[acao]} // Ensure boolean
                                                                    onChange={() => togglePermissao(modulo, acao)}
                                                                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
                            <button
                                onClick={() => setEditingPerfil(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Save size={18} />
                                Salvar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
