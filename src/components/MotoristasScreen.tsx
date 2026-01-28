
import React, { useState, useEffect } from 'react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { Plus, Search, Save, X, Edit, Trash2, MapPin, User, FileText, Truck, Calendar } from 'lucide-react';
import { api, db, operationalService, Estado } from '../services/api';

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
    cnh?: string;
    cnhCategoria?: string;
    cnhValidade?: string;
    pis?: string;
    status: 'ATIVO' | 'INATIVO';
}

export function MotoristasScreen() {
    const [motoristas, setMotoristas] = useState<Colaborador[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMotorista, setEditingMotorista] = useState<Partial<Colaborador> | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'GERAL' | 'ENDERECO' | 'DOCS'>('GERAL');
    const [listaEstados, setListaEstados] = useState<Estado[]>([]);

    useEffect(() => {
        loadMotoristas();
        loadEstados();
    }, []);

    const loadEstados = async () => {
        try {
            const states = await operationalService.listarEstados();
            setListaEstados(states);
        } catch (e) { console.error(e); }
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        if (cep && editingMotorista) {
            const data = await operationalService.buscarCep(cep);
            if (data) {
                setEditingMotorista(prev => ({
                    ...prev,
                    logradouro: data.logradouro || prev?.logradouro,
                    bairro: data.bairro || prev?.bairro,
                    cidade: data.cidade || prev?.cidade,
                    estado: data.uf || prev?.estado
                }));
            }
        }
    };

    const loadMotoristas = async () => {
        setLoading(true);
        try {
            const all = await operationalService.listarColaboradores();
            setMotoristas(all.filter(c => c.cargo?.toUpperCase().includes('MOTORISTA')));
        } catch (error) {
            console.error('Erro ao carregar motoristas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingMotorista?.nome || !editingMotorista.cpf) return alert('Campos obrigatórios: Nome e CPF');

        try {
            const empresaId = db.empresaAtual?.id || 'emp-001';

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

            const payload = { ...sanitize(editingMotorista), empresaId };

            if (payload.id) {
                await operationalService.atualizarColaborador(payload.id, payload);
            } else {
                await operationalService.criarColaborador(payload as any);
            }
            setEditingMotorista(null);
            loadMotoristas();
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const msg = error.response?.data?.message || error.message || 'Erro desconhecido';
            alert(`Erro ao salvar motorista: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Excluir motorista?')) {
            try {
                await operationalService.removerColaborador(id);
                loadMotoristas();
            } catch (error) { console.error(error); }
        }
    };

    return (
        <LayoutWrapper title="Gestão de Motoristas" subtitle="Cadastre sua equipe logistica">
            {!editingMotorista ? (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <ModernInput
                                placeholder="Buscar motorista..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ModernButton onClick={() => {
                            setEditingMotorista({
                                nome: '', cpf: '', cargo: 'MOTORISTA', status: 'ATIVO'
                            });
                            setActiveTab('GERAL');
                        }}>
                            <Plus size={20} /> Novo Motorista
                        </ModernButton>
                    </div>

                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-left text-blue-100">
                            <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
                                <tr>
                                    <th className="p-4">Nome</th>
                                    <th className="p-4">CPF</th>
                                    <th className="p-4">CNH</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Validade CNH</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {motoristas.filter(v => v.nome.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                                    <tr key={v.id} className="hover:bg-white/5">
                                        <td className="p-4 font-medium text-white">{v.nome}</td>
                                        <td className="p-4">{v.cpf}</td>
                                        <td className="p-4">{v.cnh || '-'}</td>
                                        <td className="p-4">{v.cnhCategoria || '-'}</td>
                                        <td className="p-4">{v.cnhValidade ? new Date(v.cnhValidade).toLocaleDateString() : '-'}</td>
                                        <td className="p-4">{v.status}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => setEditingMotorista(v)} className="p-2 hover:bg-white/10 rounded text-blue-300"><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-white/10 rounded text-red-400"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </GlassCard>
                </div>
            ) : (
                <GlassCard className="max-w-4xl mx-auto p-0 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Truck className="text-indigo-400" />
                            {editingMotorista.id ? 'Editar Motorista' : 'Novo Motorista'}
                        </h2>
                        <button onClick={() => setEditingMotorista(null)}><X size={24} className="text-white/50 hover:text-white" /></button>
                    </div>

                    <div className="flex border-b border-white/10 bg-black/20">
                        <TabButton id="GERAL" label="Dados Gerais" icon={User} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="ENDERECO" label="Endereço" icon={MapPin} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="DOCS" label="Documentos & CNH" icon={FileText} active={activeTab} onClick={setActiveTab} />
                    </div>

                    <div className="p-6 space-y-6">
                        {activeTab === 'GERAL' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModernInput label="Nome Completo" value={editingMotorista.nome} onChange={e => setEditingMotorista({ ...editingMotorista, nome: e.target.value })} containerClassName="col-span-2" />
                                <ModernInput label="CPF" value={editingMotorista.cpf} onChange={e => setEditingMotorista({ ...editingMotorista, cpf: e.target.value })} />
                                <ModernInput label="Cargo" value={editingMotorista.cargo} onChange={e => setEditingMotorista({ ...editingMotorista, cargo: e.target.value })} disabled />
                                <ModernInput label="Celular" value={editingMotorista.celular || ''} onChange={e => setEditingMotorista({ ...editingMotorista, celular: e.target.value })} />
                                <ModernInput label="Email" value={editingMotorista.email || ''} onChange={e => setEditingMotorista({ ...editingMotorista, email: e.target.value })} />
                            </div>
                        )}

                        {activeTab === 'ENDERECO' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <ModernInput label="CEP" value={editingMotorista.cep || ''} onChange={e => setEditingMotorista({ ...editingMotorista, cep: e.target.value })} onBlur={handleCepBlur} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Logradouro" value={editingMotorista.logradouro || ''} onChange={e => setEditingMotorista({ ...editingMotorista, logradouro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Número" value={editingMotorista.numero || ''} onChange={e => setEditingMotorista({ ...editingMotorista, numero: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <ModernInput label="Bairro" value={editingMotorista.bairro || ''} onChange={e => setEditingMotorista({ ...editingMotorista, bairro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Complemento" value={editingMotorista.complemento || ''} onChange={e => setEditingMotorista({ ...editingMotorista, complemento: e.target.value })} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Cidade" value={editingMotorista.cidade || ''} onChange={e => setEditingMotorista({ ...editingMotorista, cidade: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-blue-200 ml-1 block mb-1">UF</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            value={editingMotorista.estado || ''}
                                            onChange={e => setEditingMotorista({ ...editingMotorista, estado: e.target.value })}
                                        >
                                            <option value="">Selecione</option>
                                            {listaEstados.map(uf => (
                                                <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'DOCS' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModernInput label="Número CNH" value={editingMotorista.cnh || ''} onChange={e => setEditingMotorista({ ...editingMotorista, cnh: e.target.value })} />
                                <ModernInput label="Categoria" value={editingMotorista.cnhCategoria || ''} onChange={e => setEditingMotorista({ ...editingMotorista, cnhCategoria: e.target.value })} placeholder="Ex: AB, D, E" />
                                <ModernInput label="Validade CNH" type="date" value={editingMotorista.cnhValidade?.split('T')[0] || ''} onChange={e => setEditingMotorista({ ...editingMotorista, cnhValidade: e.target.value })} />
                                <ModernInput label="PIS/PASEP" value={editingMotorista.pis || ''} onChange={e => setEditingMotorista({ ...editingMotorista, pis: e.target.value })} />
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                        <ModernButton variant="ghost" onClick={() => setEditingMotorista(null)}>Cancelar</ModernButton>
                        <ModernButton onClick={handleSave}><Save size={18} /> Salvar Motorista</ModernButton>
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
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${active === id ? 'text-white' : 'text-white/50 hover:text-white'}`}
        >
            <span className="flex items-center gap-2"><Icon size={16} /> {label}</span>
            {active === id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500"></div>}
        </button>
    );
}
