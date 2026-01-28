
import React, { useState, useEffect } from 'react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { Plus, Search, Save, X, Edit, Trash2, MapPin, User, FileText, Users, Camera, Upload } from 'lucide-react';
import { api, db, operationalService, Estado } from '../services/api';

interface Dependente {
    id?: string;
    nome: string;
    parentesco: string;
    cpf?: string;
    dataNascimento?: string;
}

interface Colaborador {
    id: string;
    nome: string;
    cpf: string;
    rg?: string;
    dataNascimento?: string;
    cargo: string;
    dataAdmissao?: string;
    email?: string;
    telefone?: string;
    celular?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    pis?: string;
    ctps?: string;
    cnh?: string;
    cnhCategoria?: string;
    cnhValidade?: string;
    status: 'ATIVO' | 'INATIVO';
    dependentes?: Dependente[];
}

export function FuncionariosScreen() {
    const [funcionarios, setFuncionarios] = useState<Colaborador[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingFuncionario, setEditingFuncionario] = useState<Partial<Colaborador> | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'GERAL' | 'ENDERECO' | 'DOCS' | 'DEPENDENTES'>('GERAL');
    const [tempDependente, setTempDependente] = useState<Partial<Dependente>>({});
    const [listaEstados, setListaEstados] = useState<Estado[]>([]);

    const loadEstados = async () => {
        try {
            const states = await operationalService.listarEstados();
            setListaEstados(states);
        } catch (e) { console.error(e); }
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        if (cep && editingFuncionario) {
            const data = await operationalService.buscarCep(cep);
            if (data) {
                setEditingFuncionario(prev => ({
                    ...prev,
                    logradouro: data.logradouro || prev?.logradouro,
                    bairro: data.bairro || prev?.bairro,
                    cidade: data.cidade || prev?.cidade,
                    estado: data.uf || prev?.estado
                }));
            }
        }
    };

    useEffect(() => {
        loadFuncionarios();
        loadEstados();
    }, []);

    const loadFuncionarios = async () => {
        setLoading(true);
        try {
            const all = await operationalService.listarColaboradores();
            // Filter out 'Vendedor' if needed, or keep all
            setFuncionarios(all.filter(c => !c.cargo?.toUpperCase().includes('VENDEDOR') && !c.cargo?.toUpperCase().includes('MOTORISTA')));
        } catch (error) {
            console.error('Erro ao carregar func:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingFuncionario?.nome || !editingFuncionario.cpf) return alert('Campos obrigatórios: Nome e CPF');

        try {
            const empresaId = db.empresaAtual?.id || 'emp-001';
            const payload = { ...editingFuncionario, empresaId };

            if (payload.id) {
                // Backend may or may not support recursive update, but service has fallback
                await operationalService.atualizarColaborador(payload.id, payload);
            } else {
                await operationalService.criarColaborador(payload as any);
            }
            setEditingFuncionario(null);
            loadFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar.');
        }
    };

    const addDependente = () => {
        if (!tempDependente.nome || !tempDependente.parentesco) return alert('Preencha nome e parentesco');
        setEditingFuncionario(prev => ({
            ...prev,
            dependentes: [...(prev?.dependentes || []), tempDependente as Dependente]
        }));
        setTempDependente({});
    };

    const removeDependente = (index: number) => {
        setEditingFuncionario(prev => ({
            ...prev,
            dependentes: prev?.dependentes?.filter((_, i) => i !== index)
        }));
    };

    const handleDelete = async (id: string) => {
        if (confirm('Excluir funcionário?')) {
            try {
                await operationalService.removerColaborador(id);
                loadFuncionarios();
            } catch (error) { console.error(error); }
        }
    };

    return (
        <LayoutWrapper title="Gestão de Funcionários" subtitle="Cadastre sua equipe completa">
            {!editingFuncionario ? (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <ModernInput
                                placeholder="Buscar funcionário..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ModernButton onClick={() => {
                            setEditingFuncionario({
                                nome: '', cpf: '', cargo: '', status: 'ATIVO', dependentes: []
                            });
                            setActiveTab('GERAL');
                        }}>
                            <Plus size={20} /> Novo Funcionário
                        </ModernButton>
                    </div>

                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-left text-blue-100">
                            <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
                                <tr>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">CPF</th>
                                    <th className="p-4">Cargo</th>
                                    <th className="p-4">Admissão</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {funcionarios.filter(v => v.nome.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                                    <tr key={v.id} className="hover:bg-white/5">
                                        <td className="p-4 font-medium text-white">{v.nome}</td>
                                        <td className="p-4">{v.cpf}</td>
                                        <td className="p-4">{v.cargo}</td>
                                        <td className="p-4">{v.dataAdmissao ? new Date(v.dataAdmissao).toLocaleDateString() : '-'}</td>
                                        <td className="p-4">{v.status}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => setEditingFuncionario(v)} className="p-2 hover:bg-white/10 rounded text-blue-300"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-white/10 rounded text-red-400"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                </div>
            ) : (
                <GlassCard className="max-w-5xl mx-auto p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="text-indigo-400" />
                            {editingFuncionario.id ? 'Editar Funcionário' : 'Novo Funcionário'}
                        </h2>
                        <button onClick={() => setEditingFuncionario(null)}><X size={24} className="text-white/50 hover:text-white" /></button>
                    </div>

                    <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto">
                        <TabButton id="GERAL" label="Dados Gerais" icon={User} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="ENDERECO" label="Endereço" icon={MapPin} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="DOCS" label="Documentos" icon={FileText} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="DEPENDENTES" label="Dependentes" icon={Users} active={activeTab} onClick={setActiveTab} />
                    </div>

                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {activeTab === 'GERAL' && (
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-3 flex flex-col items-center gap-2">
                                    <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                                        {editingFuncionario.nome ? <span className="text-3xl text-white/20">{editingFuncionario.nome.charAt(0)}</span> : <Camera className="text-white/30" />}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-white/50">Alterar Foto</span>
                                </div>
                                <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ModernInput label="Nome Completo" value={editingFuncionario.nome} onChange={e => setEditingFuncionario({ ...editingFuncionario, nome: e.target.value })} containerClassName="col-span-2" />
                                    <ModernInput label="CPF" value={editingFuncionario.cpf} onChange={e => setEditingFuncionario({ ...editingFuncionario, cpf: e.target.value })} />
                                    <ModernInput label="RG" value={editingFuncionario.rg || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, rg: e.target.value })} />
                                    <ModernInput label="Data Nascimento" type="date" value={editingFuncionario.dataNascimento?.split('T')[0] || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, dataNascimento: e.target.value })} />
                                    <ModernInput label="Cargo" value={editingFuncionario.cargo} onChange={e => setEditingFuncionario({ ...editingFuncionario, cargo: e.target.value })} />
                                    <ModernInput label="Data Admissão" type="date" value={editingFuncionario.dataAdmissao?.split('T')[0] || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, dataAdmissao: e.target.value })} />
                                    <ModernInput label="Email" value={editingFuncionario.email || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, email: e.target.value })} />
                                    <ModernInput label="Celular" value={editingFuncionario.celular || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, celular: e.target.value })} />
                                    <ModernInput label="Telefone" value={editingFuncionario.telefone || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, telefone: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'ENDERECO' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <ModernInput label="CEP" value={editingFuncionario.cep || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, cep: e.target.value })} onBlur={handleCepBlur} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Logradouro" value={editingFuncionario.logradouro || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, logradouro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Número" value={editingFuncionario.numero || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, numero: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <ModernInput label="Bairro" value={editingFuncionario.bairro || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, bairro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Complemento" value={editingFuncionario.complemento || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, complemento: e.target.value })} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Cidade" value={editingFuncionario.cidade || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, cidade: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-sm font-medium text-blue-200 ml-1 block mb-1">UF</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        value={editingFuncionario.estado || ''}
                                        onChange={e => setEditingFuncionario({ ...editingFuncionario, estado: e.target.value })}
                                    >
                                        <option value="">Selecione</option>
                                        {listaEstados.map(uf => (
                                            <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'DOCS' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModernInput label="PIS/PASEP" value={editingFuncionario.pis || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, pis: e.target.value })} />
                                <ModernInput label="CTPS (Carteira de Trabalho)" value={editingFuncionario.ctps || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, ctps: e.target.value })} />
                                <ModernInput label="CNH" value={editingFuncionario.cnh || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, cnh: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ModernInput label="Categoria CNH" value={editingFuncionario.cnhCategoria || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, cnhCategoria: e.target.value })} />
                                    <ModernInput label="Validade CNH" type="date" value={editingFuncionario.cnhValidade?.split('T')[0] || ''} onChange={e => setEditingFuncionario({ ...editingFuncionario, cnhValidade: e.target.value })} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'DEPENDENTES' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <h3 className="text-sm font-bold text-white mb-4">Adicionar Dependente</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div className="col-span-2">
                                            <ModernInput label="Nome" value={tempDependente.nome || ''} onChange={e => setTempDependente({ ...tempDependente, nome: e.target.value })} />
                                        </div>
                                        <ModernInput label="Parentesco" placeholder="Filho, Cônjuge..." value={tempDependente.parentesco || ''} onChange={e => setTempDependente({ ...tempDependente, parentesco: e.target.value })} />
                                        <ModernInput label="Data Nasc." type="date" value={tempDependente.dataNascimento || ''} onChange={e => setTempDependente({ ...tempDependente, dataNascimento: e.target.value })} />
                                        <div className="col-span-1">
                                            <ModernButton onClick={addDependente} className="w-full" icon={Plus}>Adicionar</ModernButton>
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full text-left text-white/80">
                                    <thead className="bg-white/5 text-xs uppercase">
                                        <tr>
                                            <th className="p-3">Nome</th>
                                            <th className="p-3">Parentesco</th>
                                            <th className="p-3">Data Nasc.</th>
                                            <th className="p-3 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {editingFuncionario.dependentes?.map((dep, idx) => (
                                            <tr key={idx}>
                                                <td className="p-3">{dep.nome}</td>
                                                <td className="p-3">{dep.parentesco}</td>
                                                <td className="p-3">{dep.dataNascimento}</td>
                                                <td className="p-3 text-right">
                                                    <button onClick={() => removeDependente(idx)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!editingFuncionario.dependentes || editingFuncionario.dependentes.length === 0) && (
                                            <tr><td colSpan={4} className="p-4 text-center text-white/30">Nenhum dependente cadastrado.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                        <ModernButton variant="ghost" onClick={() => setEditingFuncionario(null)}>Cancelar</ModernButton>
                        <ModernButton onClick={handleSave}><Save size={18} /> Salvar Funcionário</ModernButton>
                    </div>
                </GlassCard>
            )}
        </LayoutWrapper>
    );
}

function TabButton({ id, label, icon: Icon, active, onClick }: any) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${active === id ? 'text-white' : 'text-white/50 hover:text-white'}`}
        >
            <span className="flex items-center gap-2"><Icon size={16} /> {label}</span>
            {active === id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
        </button>
    );
}
