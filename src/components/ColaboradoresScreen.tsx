import { useState, useEffect } from 'react';
import { dbService, db } from '../services/api';
import { Colaborador } from '../types';
import { Users, Plus, X, Pencil, Trash2, Briefcase, Search, Save, Building, User } from 'lucide-react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';

export function ColaboradoresScreen({ embedded = false }: { embedded?: boolean }) {
    const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingColaborador, setEditingColaborador] = useState<Partial<Colaborador> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const data = await dbService.operationalService.listarColaboradores();
            setColaboradores(data);
        } catch (e) {
            console.error("Erro ao carregar colaboradores", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingColaborador?.nome || !editingColaborador.cpf) return alert('Preencha os campos obrigatórios');

        try {
            if (editingColaborador.id) {
                await dbService.operationalService.atualizarColaborador(editingColaborador.id, editingColaborador);
            } else {
                await dbService.operationalService.criarColaborador({
                    ...editingColaborador,
                    empresaId: db.empresaAtual?.id,
                    dataAdmissao: editingColaborador.dataAdmissao || new Date(),
                    status: editingColaborador.status || 'ATIVO'
                } as any);
            }
            setEditingColaborador(null);
            carregarDados();
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar colaborador');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
            try {
                await dbService.operationalService.removerColaborador(id);
                carregarDados();
            } catch (e) {
                console.error(e);
                alert('Erro ao excluir colaborador');
            }
        }
    };

    const filteredColaboradores = colaboradores.filter(c =>
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cpf.includes(searchTerm)
    );

    return (
        <LayoutWrapper title="Gestão de Colaboradores" subtitle="Cadastre e gerencie sua equipe" embedded={embedded}>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-96">
                    <ModernInput
                        placeholder="Buscar colaborador..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        icon={<Search size={18} className="text-blue-200/50" />}
                    />
                </div>
                <ModernButton
                    onClick={() => setEditingColaborador({ nome: '', cpf: '', cargo: '', departamento: '', status: 'ATIVO' })}
                    icon={Plus}
                >
                    Novo Colaborador
                </ModernButton>
            </div>

            {/* Tabela de Colaboradores */}
            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-white/90">
                        <thead className="bg-white/10 border-b border-white/5 text-xs uppercase text-blue-100/70 font-bold">
                            <tr>
                                <th className="p-4 pl-6">Nome</th>
                                <th className="p-4">CPF</th>
                                <th className="p-4">Cargo</th>
                                <th className="p-4">Departamento</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-white/50">Carregando...</td></tr>
                            ) : filteredColaboradores.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-white/50">Nenhum colaborador encontrado.</td></tr>
                            ) : (
                                filteredColaboradores.map(colaborador => (
                                    <tr key={colaborador.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-white group-hover:text-indigo-200 transition-colors">{colaborador.nome}</div>
                                            <div className="text-xs text-white/50">{new Date(colaborador.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4 text-white/70 font-mono text-sm">{colaborador.cpf}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-indigo-400" />
                                                <span className="text-sm text-white/90">{colaborador.cargo}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-white/70">{colaborador.departamento}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold border ${colaborador.status === 'ATIVO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                                {colaborador.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setEditingColaborador(colaborador)} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(colaborador.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-500 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Modal */}
            {editingColaborador && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <GlassCard className="w-full max-w-lg p-0 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="text-indigo-400" />
                                {editingColaborador.id ? 'Editar Colaborador' : 'Novo Colaborador'}
                            </h2>
                            <button onClick={() => setEditingColaborador(null)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            <ModernInput
                                label="Nome Completo"
                                icon={<User size={16} />}
                                value={editingColaborador.nome || ''}
                                onChange={e => setEditingColaborador({ ...editingColaborador, nome: e.target.value })}
                            />

                            <ModernInput
                                label="CPF"
                                value={editingColaborador.cpf || ''}
                                onChange={e => setEditingColaborador({ ...editingColaborador, cpf: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <ModernInput
                                    label="Cargo"
                                    icon={<Briefcase size={16} />}
                                    value={editingColaborador.cargo || ''}
                                    onChange={e => setEditingColaborador({ ...editingColaborador, cargo: e.target.value })}
                                />
                                <ModernInput
                                    label="Departamento"
                                    icon={<Building size={16} />}
                                    value={editingColaborador.departamento || ''}
                                    onChange={e => setEditingColaborador({ ...editingColaborador, departamento: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-200 mb-1.5 ml-1">Status</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:bg-black/40 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800 transition-all"
                                    value={editingColaborador.status || 'ATIVO'}
                                    onChange={e => setEditingColaborador({ ...editingColaborador, status: e.target.value as any })}
                                >
                                    <option value="ATIVO" className="bg-slate-800">Ativo</option>
                                    <option value="INATIVO" className="bg-slate-800">Inativo</option>
                                    <option value="AFASTADO" className="bg-slate-800">Afastado</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3 rounded-b-2xl">
                            <ModernButton variant="secondary" onClick={() => setEditingColaborador(null)}>
                                Cancelar
                            </ModernButton>
                            <ModernButton onClick={handleSave} icon={Save}>
                                Salvar Colaborador
                            </ModernButton>
                        </div>
                    </GlassCard>
                </div>
            )}
        </LayoutWrapper>
    );
}
