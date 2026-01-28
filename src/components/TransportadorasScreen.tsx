
import React, { useState, useEffect } from 'react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { Plus, Search, Save, X, Edit, Trash2, MapPin, Building, Truck, FileText, Info } from 'lucide-react';
import { api, db, operationalService, Estado } from '../services/api';

interface Transportadora {
    id: string;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    ie?: string;
    rntrc?: string;
    email?: string;
    telefone?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    status: 'ATIVO' | 'INATIVO';
    // veiculos?: Veiculo[]; (Implementar depois veiculos aninhados)
}

export function TransportadorasScreen() {
    const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTransportadora, setEditingTransportadora] = useState<Partial<Transportadora> | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'GERAL' | 'ENDERECO' | 'FROTA'>('GERAL');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await operationalService.listarTransportadoras();
            setTransportadoras(data);
        } catch (error) {
            console.error('Erro ao carregar transp:', error);
            // Fallback empty if everything fails
            setTransportadoras([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingTransportadora?.razaoSocial || !editingTransportadora.cnpj) return alert('Campos obrigatórios: Razão Social e CNPJ');

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

            const payload = { ...sanitize(editingTransportadora), empresaId };

            if (payload.id) {
                await operationalService.atualizarTransportadora(payload.id, payload);
            } else {
                await operationalService.criarTransportadora(payload as any);
            }
            setEditingTransportadora(null);
            loadData();
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            const msg = error.response?.data?.message || error.message || 'Erro desconhecido';
            alert(`Erro ao salvar: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Excluir transportadora?')) {
            try {
                await operationalService.removerTransportadora(id);
                loadData();
            } catch (error) { console.error(error); }
        }
    };

    return (
        <LayoutWrapper title="Gestão de Transportadoras" subtitle="Parceiros logísticos e frota">
            {!editingTransportadora ? (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <ModernInput
                                placeholder="Buscar transportadora..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <ModernButton onClick={() => {
                            setEditingTransportadora({
                                razaoSocial: '', nomeFantasia: '', cnpj: '', status: 'ATIVO'
                            });
                            setActiveTab('GERAL');
                        }}>
                            <Plus size={20} /> Nova Transportadora
                        </ModernButton>
                    </div>

                    <GlassCard className="p-0 overflow-hidden">
                        <table className="w-full text-left text-blue-100">
                            <thead className="bg-white/5 text-xs uppercase font-semibold text-white">
                                <tr>
                                    <th className="p-4">Razão Social / Fantasia</th>
                                    <th className="p-4">CNPJ</th>
                                    <th className="p-4">RNTRC</th>
                                    <th className="p-4">Cidade/UF</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transportadoras.filter(v => v.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) || v.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                                    <tr key={v.id} className="hover:bg-white/5">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{v.nomeFantasia}</div>
                                            <div className="text-xs text-white/50">{v.razaoSocial}</div>
                                        </td>
                                        <td className="p-4">{v.cnpj}</td>
                                        <td className="p-4">{v.rntrc || '-'}</td>
                                        <td className="p-4">{v.cidade}/{v.estado}</td>
                                        <td className="p-4">{v.status}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={() => setEditingTransportadora(v)} className="p-2 hover:bg-white/10 rounded text-blue-300"><Edit size={16} /></button>
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
                            <Truck className="text-indigo-400" />
                            {editingTransportadora.id ? 'Editar Transportadora' : 'Nova Transportadora'}
                        </h2>
                        <button onClick={() => setEditingTransportadora(null)}><X size={24} className="text-white/50 hover:text-white" /></button>
                    </div>

                    <div className="flex border-b border-white/10 bg-black/20">
                        <TabButton id="GERAL" label="Dados Gerais" icon={Building} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="ENDERECO" label="Endereço" icon={MapPin} active={activeTab} onClick={setActiveTab} />
                        <TabButton id="FROTA" label="Info. Específicas" icon={Info} active={activeTab} onClick={setActiveTab} />
                    </div>

                    <div className="p-6 space-y-6">
                        {activeTab === 'GERAL' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModernInput label="Razão Social" value={editingTransportadora.razaoSocial} onChange={e => setEditingTransportadora({ ...editingTransportadora, razaoSocial: e.target.value })} />
                                <ModernInput label="Nome Fantasia" value={editingTransportadora.nomeFantasia} onChange={e => setEditingTransportadora({ ...editingTransportadora, nomeFantasia: e.target.value })} />
                                <ModernInput label="CNPJ" value={editingTransportadora.cnpj} onChange={e => setEditingTransportadora({ ...editingTransportadora, cnpj: e.target.value })} />
                                <ModernInput label="Inscrição Estadual" value={editingTransportadora.ie || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, ie: e.target.value })} />
                                <ModernInput label="Registro ANTT (RNTRC)" value={editingTransportadora.rntrc || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, rntrc: e.target.value })} />
                                <ModernInput label="Telefone" value={editingTransportadora.telefone || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, telefone: e.target.value })} />
                                <ModernInput label="Email" value={editingTransportadora.email || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, email: e.target.value })} />
                            </div>
                        )}

                        {activeTab === 'ENDERECO' && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-1">
                                    <ModernInput label="CEP" value={editingTransportadora.cep || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, cep: e.target.value })} onBlur={handleCepBlur} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Logradouro" value={editingTransportadora.logradouro || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, logradouro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Número" value={editingTransportadora.numero || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, numero: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <ModernInput label="Bairro" value={editingTransportadora.bairro || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, bairro: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <ModernInput label="Complemento" value={editingTransportadora.complemento || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, complemento: e.target.value })} />
                                </div>
                                <div className="col-span-3">
                                    <ModernInput label="Cidade" value={editingTransportadora.cidade || ''} onChange={e => setEditingTransportadora({ ...editingTransportadora, cidade: e.target.value })} />
                                </div>
                                <div className="col-span-1">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-blue-200 ml-1 block mb-1">UF</label>
                                        <select
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            value={editingTransportadora.estado || ''}
                                            onChange={e => setEditingTransportadora({ ...editingTransportadora, estado: e.target.value })}
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

                        {activeTab === 'FROTA' && (
                            <div className="text-center p-12 text-white/50 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <Truck size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Gestão de Frota e Veículos será implementada aqui.</p>
                                <p className="text-sm mt-2">Você poderá cadastrar as placas e tipos de veículos vinculados a esta transportadora.</p>
                                <ModernButton className="mt-4 mx-auto" variant="secondary" onClick={() => alert('Em breve')}>Gerenciar Veículos</ModernButton>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                        <ModernButton variant="ghost" onClick={() => setEditingTransportadora(null)}>Cancelar</ModernButton>
                        <ModernButton onClick={handleSave}><Save size={18} /> Salvar Transportadora</ModernButton>
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
