import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, ArrowLeft, Users, UserPlus, CheckCircle2, Ban, Edit, X, Shield, Briefcase } from 'lucide-react';
import { areasComerciaisService, db } from '../services/api';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';

interface AreasComerciaisScreenProps {
    onBack?: () => void;
}

// Interfaces Mockadas para dependencias
interface Vendedor { id: string; nome: string; }
interface FuncaoComercial { id: number; nome: string; }
interface PerfilComissao { id: number; nome: string; }

interface RepresentanteArea {
    id: string; // Temporário para UI
    vendedorId: string;
    funcaoComercialId: number;
    perfilComissaoId: number;

    // Virtual fields for display
    vendedorNome?: string;
    funcaoNome?: string;
    perfilNome?: string;
}

interface AreaComercial {
    id?: string;
    nome: string;
    descricao: string;
    representantes: RepresentanteArea[];
}

// Mock Data
const MOCK_VENDEDORES: Vendedor[] = [
    { id: '1', nome: 'Carlos Silva' },
    { id: '2', nome: 'Ana Souza' },
    { id: '3', nome: 'Roberto Alves' },
    { id: '4', nome: 'Fernanda Lima' },
];

const MOCK_FUNCOES: FuncaoComercial[] = [
    { id: 1, nome: 'Diretor Comercial' },
    { id: 2, nome: 'Gerente Nacional' },
    { id: 3, nome: 'Gerente Regional' },
    { id: 4, nome: 'Supervisor' },
    { id: 5, nome: 'Vendedor' },
];

const MOCK_PERFIS: PerfilComissao[] = [
    { id: 1, nome: 'Padrão (2%)' },
    { id: 2, nome: 'Agressivo (5%)' },
    { id: 3, nome: 'Gerência (1.5% Sobreposta)' },
];

export function AreasComerciaisScreen({ onBack }: AreasComerciaisScreenProps) {
    const [areas, setAreas] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Estado Principal do Formulário
    const [formData, setFormData] = useState<AreaComercial>({
        nome: '',
        descricao: '',
        representantes: []
    });

    // Estado do Formulário de Representante (Sub-form)
    const [repForm, setRepForm] = useState<Partial<RepresentanteArea>>({});
    const [showRepForm, setShowRepForm] = useState(false);

    const empresaId = db.empresaAtual?.id || '';

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const data = await areasComerciaisService.listar(empresaId);
        setAreas(data);
    }

    const handleAddRespresentante = () => {
        if (!repForm.vendedorId || !repForm.funcaoComercialId || !repForm.perfilComissaoId) {
            return alert('Preencha todos os campos do representante.');
        }

        // Validação de Função Única
        const funcaoExistente = formData.representantes.some(r => r.funcaoComercialId === repForm.funcaoComercialId);
        if (funcaoExistente) {
            return alert('Já existe um representante com esta Função Comercial nesta área. Apenas um representante por função é permitido.');
        }

        const novoRep: RepresentanteArea = {
            id: Date.now().toString(),
            vendedorId: repForm.vendedorId,
            funcaoComercialId: repForm.funcaoComercialId,
            perfilComissaoId: repForm.perfilComissaoId,
            vendedorNome: MOCK_VENDEDORES.find(v => v.id === repForm.vendedorId)?.nome,
            funcaoNome: MOCK_FUNCOES.find(f => f.id === repForm.funcaoComercialId)?.nome,
            perfilNome: MOCK_PERFIS.find(p => p.id === repForm.perfilComissaoId)?.nome,
        };

        setFormData(prev => ({
            ...prev,
            representantes: [...prev.representantes, novoRep]
        }));

        // Reset Rep Form but keep open for rapid entry? Or close? User asked: "dando opção de criar um novo representante"
        setRepForm({});
        setShowRepForm(false);
    };

    const handleRemoveRepresentante = (id: string) => {
        setFormData(prev => ({
            ...prev,
            representantes: prev.representantes.filter(r => r.id !== id)
        }));
    };

    async function handleSaveArea() {
        if (!formData.nome) return alert('Nome da área é obrigatório');

        // Validação Obrigatória: Pelo menos um Vendedor
        const temVendedor = formData.representantes.some(r => r.funcaoNome === 'Vendedor');
        if (!temVendedor) {
            return alert('É obrigatório adicionar pelo menos um Vendedor (Função Comercial: Vendedor) para salvar a área.');
        }

        // Em um cenário real, salvaríamos a estrutura aninhada
        // O serviço atual é simples, então vamos simular ou adaptar
        const payload = { ...formData, empresaId };

        console.log("Salvando Área Completa:", payload);

        // Mock save logic as the real service might not support nested reps yet
        // await areasComerciaisService.criar(payload); 
        // For UI feedback only:
        const novaArea = { ...payload, id: Date.now() };
        setAreas([...areas, novaArea]);

        setShowForm(false);
        setFormData({ nome: '', descricao: '', representantes: [] });
    }

    return (
        <LayoutWrapper title="Áreas Comerciais" subtitle="Gestão de territórios e equipes" embedded={!onBack} hideHeader={false}>
            <div className="flex flex-col gap-6">
                {!showForm ? (
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Lista de Áreas</h2>
                            <ModernButton onClick={() => setShowForm(true)} variant="primary">
                                <Plus size={20} />
                                Nova Área
                            </ModernButton>
                        </div>
                        <div className="relative overflow-x-auto rounded-xl border border-white/5">
                            <table className="w-full text-left text-sm text-blue-100">
                                <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Descrição</th>
                                        <th className="px-6 py-4">Repres.</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {areas.map(a => (
                                        <tr key={a.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{a.nome}</td>
                                            <td className="px-6 py-4 opacity-70">{a.descricao || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-xs border border-indigo-500/30">
                                                    {a.representantes?.length || 0} Reps
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {areas.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-white/40">
                                                Nenhuma área cadastrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Coluna Principal - Dados da Área */}
                        <div className="lg:col-span-2 space-y-6">
                            <GlassCard className="p-6">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Users className="text-indigo-400" />
                                        Dados da Área
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <ModernInput
                                        label="Nome da Área"
                                        value={formData.nome}
                                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                        placeholder="Ex: Região Norte, Grande São Paulo..."
                                    />
                                    <ModernInput
                                        label="Descrição"
                                        value={formData.descricao}
                                        onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                        placeholder="Observações sobre o território..."
                                    />
                                </div>
                            </GlassCard>

                            {/* Lista de Representantes Adicionados */}
                            <GlassCard className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Briefcase className="text-emerald-400" />
                                        Equipe de Representantes
                                    </h3>
                                    <ModernButton onClick={() => setShowRepForm(true)} variant="secondary">
                                        <UserPlus size={16} />
                                        Adicionar
                                    </ModernButton>
                                </div>

                                {showRepForm && (
                                    <div className="bg-slate-800/80 p-4 rounded-xl border border-indigo-500/30 mb-6 animate-in fade-in slide-in-from-top-4">
                                        <h4 className="text-sm font-bold text-indigo-300 mb-3 uppercase tracking-wider">Novo Representante</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* SELEÇÃO DE VENDEDOR */}
                                            <div>
                                                <label className="text-xs text-slate-400 font-medium mb-1 block">Vendedor</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                                                    value={repForm.vendedorId || ''}
                                                    onChange={e => setRepForm({ ...repForm, vendedorId: e.target.value })}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {MOCK_VENDEDORES.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                                                </select>
                                            </div>

                                            {/* SELEÇÃO DE FUNÇÃO */}
                                            <div>
                                                <label className="text-xs text-slate-400 font-medium mb-1 block">Função Comercial</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                                                    value={repForm.funcaoComercialId || ''}
                                                    onChange={e => setRepForm({ ...repForm, funcaoComercialId: Number(e.target.value) })}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {MOCK_FUNCOES.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                                                </select>
                                            </div>

                                            {/* SELEÇÃO DE PERFIL */}
                                            <div className="md:col-span-2">
                                                <label className="text-xs text-slate-400 font-medium mb-1 block">Perfil de Comissão</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                                                    value={repForm.perfilComissaoId || ''}
                                                    onChange={e => setRepForm({ ...repForm, perfilComissaoId: Number(e.target.value) })}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {MOCK_PERFIS.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button onClick={() => setShowRepForm(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancelar</button>
                                            <button onClick={handleAddRespresentante} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                                                <CheckCircle2 size={14} /> Salvar Representante
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {formData.representantes.map((rep, idx) => (
                                        <div key={rep.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs">
                                                    {rep.funcaoNome?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{rep.vendedorNome}</p>
                                                    <div className="flex items-center gap-2 text-xs text-white/50">
                                                        <span>{rep.funcaoNome}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/30"></span>
                                                        <span>{rep.perfilNome}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveRepresentante(rep.id)} className="text-white/30 hover:text-red-400 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.representantes.length === 0 && !showRepForm && (
                                        <div className="text-center py-8 text-white/30 text-sm border-2 border-dashed border-white/10 rounded-xl">
                                            Nenhum representante adicionado nesta área.
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Coluna Lateral - Resumo/Ações */}
                        <div className="space-y-6">
                            <GlassCard className="p-6 sticky top-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Ações</h3>
                                <div className="space-y-3">
                                    <ModernButton onClick={handleSaveArea} variant="primary" className="w-full justify-center py-4 text-base">
                                        <Save size={20} />
                                        Salvar Área
                                    </ModernButton>
                                    <ModernButton onClick={() => setShowForm(false)} variant="ghost" className="w-full justify-center">
                                        Cancelar
                                    </ModernButton>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 mb-2">Resumo</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-slate-300">
                                            <span>Nome:</span>
                                            <span className="text-white truncate max-w-[120px]">{formData.nome || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-300">
                                            <span>Representantes:</span>
                                            <span className="text-white">{formData.representantes.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    );
}
