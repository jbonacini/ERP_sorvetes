
import React, { useState, useEffect } from 'react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { Plus, Search, Save, X, Edit, Trash2, MapPin, User, Briefcase } from 'lucide-react';
import { api, db, operationalService, Estado } from '../services/api';

// Enumere tipos se necessário, ou use string simples
interface Colaborador {
    id: string;
    nome: string;
    cpf: string;
    cargo: string;
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
    funcaoComercialId?: string;
    status: 'ATIVO' | 'INATIVO';
}

export function VendedoresScreen() {
    const [vendedores, setVendedores] = useState<Colaborador[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingVendedor, setEditingVendedor] = useState<Partial<Colaborador> | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'GERAL' | 'ENDERECO'>('GERAL');
    const [listaEstados, setListaEstados] = useState<Estado[]>([]);

    useEffect(() => {
        loadVendedores();
        loadEstados();
    }, []);

    const loadEstados = async () => {
        try {
            const states = await operationalService.listarEstados();
            setListaEstados(states);
        } catch (e) {
            console.error('Erro ao carregar estados', e);
        }
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        if (cep && editingVendedor) {
            const data = await operationalService.buscarCep(cep);
            if (data) {
                setEditingVendedor(prev => ({
                    ...prev,
                    logradouro: data.logradouro || prev?.logradouro,
                    bairro: data.bairro || prev?.bairro,
                    cidade: data.cidade || prev?.cidade,
                    estado: data.uf || prev?.estado
                }));
            }
        }
    };

    const loadVendedores = async () => {
        setLoading(true);
        try {
            // Filtrar apenas vendedores se houver distinção no backend, ou trazer todos e filtrar no front por enquanto
            // Ideal: api.get('/colaboradores?cargo=VENDEDOR')
            const all = await operationalService.listarColaboradores();
            // Filtro simples por cargo contendo "vendedor" ou similar, se não houver flag específica
            setVendedores(all.filter(c => c.cargo?.toUpperCase().includes('VENDEDOR') || c.cargo?.toUpperCase().includes('REPRESENTANTE')));
        } catch (error) {
            console.error('Erro ao carregar vendedores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingVendedor?.nome || !editingVendedor.cpf) return alert('Campos obrigatórios: Nome e CPF');

        try {
            const empresaId = db.empresaAtual?.id || 'emp-001';

            // Função auxiliar para limpar campos vazios
            const sanitize = (obj: any) => {
                const cleaned: any = {};
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    if (value !== '' && value !== null && value !== undefined) {
                        cleaned[key] = value;
                    }
                });
                return cleaned;
            };

            const payload = {
                ...sanitize(editingVendedor),
                empresaId
            };

            if (payload.id) {
                await operationalService.atualizarColaborador(payload.id, payload);
            } else {
                await operationalService.criarColaborador(payload as any);
            }
            setEditingVendedor(null);
            loadVendedores();
            alert('Vendedor salvo com sucesso!');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const msg = error.response?.data?.message || error.message || 'Erro desconhecido';
            alert(`Erro ao salvar vendedor: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Excluir vendedor?')) {
            try {
                await api.delete(`/colaboradores/${id}`);
                loadVendedores();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <LayoutWrapper title="Gestão de Vendedores" subtitle="Cadastre seus representantes comerciais">
            {!editingVendedor ? (
                // LISTAGEM
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <ModernInput
                                placeholder="Buscar vendedor..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ModernButton onClick={() => {
                            setEditingVendedor({
                                nome: '', cpf: '', cargo: 'Vendedor', status: 'ATIVO',
                                logradouro: '', numero: '', bairro: '', cidade: '', estado: '', cep: ''
                            });
                            setActiveTab('GERAL');
                        }}>
                            <Plus size={20} /> Novo Vendedor
                        </ModernButton>
                    </div>

                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-left text-blue-100">
                            <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
                                <tr>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">CPF</th>
                                    <th className="p-4">Cargo</th>
                                    <th className="p-4">Cidade/UF</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {vendedores.filter(v => v.nome.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                                    <tr key={v.id} className="hover:bg-white/5">
                                        <td className="p-4 font-medium text-white">{v.nome}</td>
                                        <td className="p-4">{v.cpf}</td>
                                        <td className="p-4">{v.cargo}</td>
                                        <td className="p-4">{v.cidade}/{v.estado}</td>
                                        <td className="p-4">{v.status}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => setEditingVendedor(v)} className="p-2 hover:bg-white/10 rounded text-blue-300"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-white/10 rounded text-red-400"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                </div>
            ) : (
                // FORMULÁRIO COM ABAS
                <GlassCard className="max-w-4xl mx-auto p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="text-indigo-400" />
                            {editingVendedor.id ? 'Editar Vendedor' : 'Novo Vendedor'}
                        </h2>
                        <button onClick={() => setEditingVendedor(null)}><X size={24} className="text-white/50 hover:text-white" /></button>
                    </div>

                    {/* TABS HEADER */}
                    <div className="flex border-b border-white/10 bg-black/20">
                        <button
                            onClick={() => setActiveTab('GERAL')}
                            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === 'GERAL' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2"><User size={16} /> Dados Gerais</span>
                            {activeTab === 'GERAL' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('ENDERECO')}
                            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === 'ENDERECO' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2"><MapPin size={16} /> Endereço</span>
                            {activeTab === 'ENDERECO' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
                        </button>
                    </div>

                    {/* TABS CONTENT */}
                    <div className="p-6 space-y-6">
                        {activeTab === 'GERAL' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModernInput label="Nome Completo" value={editingVendedor.nome} onChange={e => setEditingVendedor({ ...editingVendedor, nome: e.target.value })} containerClassName="col-span-2" />
                                <ModernInput label="CPF" value={editingVendedor.cpf} onChange={e => setEditingVendedor({ ...editingVendedor, cpf: e.target.value })} />
                                <ModernInput label="Cargo" value={editingVendedor.cargo} onChange={e => setEditingVendedor({ ...editingVendedor, cargo: e.target.value })} />
                                <ModernInput label="Email" value={editingVendedor.email || ''} onChange={e => setEditingVendedor({ ...editingVendedor, email: e.target.value })} />
                                <ModernInput label="Celular" value={editingVendedor.celular || ''} onChange={e => setEditingVendedor({ ...editingVendedor, celular: e.target.value })} />

                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-blue-200 ml-1">Status</label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={editingVendedor.status === 'ATIVO'} onChange={() => setEditingVendedor({ ...editingVendedor, status: 'ATIVO' })} className="accent-indigo-500" />
                                            <span className="text-white">Ativo</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" checked={editingVendedor.status === 'INATIVO'} onChange={() => setEditingVendedor({ ...editingVendedor, status: 'INATIVO' })} className="accent-indigo-500" />
                                            <span className="text-white/70">Inativo</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ENDERECO' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <ModernInput label="CEP" value={editingVendedor.cep || ''} onChange={e => setEditingVendedor({ ...editingVendedor, cep: e.target.value })} onBlur={handleCepBlur} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Logradouro" value={editingVendedor.logradouro || ''} onChange={e => setEditingVendedor({ ...editingVendedor, logradouro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Número" value={editingVendedor.numero || ''} onChange={e => setEditingVendedor({ ...editingVendedor, numero: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <ModernInput label="Bairro" value={editingVendedor.bairro || ''} onChange={e => setEditingVendedor({ ...editingVendedor, bairro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Complemento" value={editingVendedor.complemento || ''} onChange={e => setEditingVendedor({ ...editingVendedor, complemento: e.target.value })} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Cidade" value={editingVendedor.cidade || ''} onChange={e => setEditingVendedor({ ...editingVendedor, cidade: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-sm font-medium text-blue-200 ml-1 block mb-1">UF</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        value={editingVendedor.estado || ''}
                                        onChange={e => setEditingVendedor({ ...editingVendedor, estado: e.target.value })}
                                    >
                                        <option value="">Selecione</option>
                                        {listaEstados.map(uf => (
                                            <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                        <ModernButton variant="ghost" onClick={() => setEditingVendedor(null)}>Cancelar</ModernButton>
                        <ModernButton onClick={handleSave}><Save size={18} /> Salvar Vendedor</ModernButton>
                    </div>
                </GlassCard>
            )}
        </LayoutWrapper>
    );
}
