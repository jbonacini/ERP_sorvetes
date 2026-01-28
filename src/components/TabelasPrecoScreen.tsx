import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, ArrowLeft, RefreshCw, Box, FileText, Check, AlertTriangle } from 'lucide-react';
import { tabelasPrecoService, db } from '../services/api';

interface TabelasPrecoScreenProps {
    onBack: () => void;
}

export function TabelasPrecoScreen({ onBack }: TabelasPrecoScreenProps) {
    const [grupos, setGrupos] = useState<any[]>([]);
    const [selectedGrupo, setSelectedGrupo] = useState<any>(null);
    const [tabelas, setTabelas] = useState<any[]>([]);
    const [selectedTabela, setSelectedTabela] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [activeTab, setActiveTab] = useState<'GERAL' | 'ITENS'>('GERAL');
    const [isEditing, setIsEditing] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        desconto: 0,
        atividadeCliente: '',
        ativo: true
    });

    const empresaId = db.empresaAtual?.id || '';

    useEffect(() => {
        loadGrupos();
    }, []);

    useEffect(() => {
        if (selectedGrupo) {
            loadTabelas(selectedGrupo.id);
            setSelectedTabela(null);
            setIsEditing(false);
        }
    }, [selectedGrupo]);

    useEffect(() => {
        if (selectedTabela) {
            // Populate form
            setFormData({
                id: selectedTabela.id,
                nome: selectedTabela.nome,
                desconto: Number(selectedTabela.desconto) || 0,
                atividadeCliente: selectedTabela.atividadeCliente || '',
                ativo: selectedTabela.ativo
            });
            setIsEditing(false); // View mode initially
            setActiveTab('GERAL');
            if (activeTab === 'ITENS') loadItens(selectedTabela.id);
        }
    }, [selectedTabela]);

    // Load items when switching to items tab
    useEffect(() => {
        if (activeTab === 'ITENS' && selectedTabela) {
            loadItens(selectedTabela.id);
        }
    }, [activeTab]);

    async function loadGrupos() {
        try {
            const data = await tabelasPrecoService.listarGrupos(empresaId);
            setGrupos(data);
            if (data.length > 0 && !selectedGrupo) setSelectedGrupo(data[0]);
        } catch (e) { console.error(e); }
    }

    async function loadTabelas(grupoId: string) {
        setLoading(true);
        try {
            const data = await tabelasPrecoService.listarTabelas(grupoId);
            setTabelas(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function loadItens(tabelaId: string) {
        setLoading(true);
        try {
            const data = await tabelasPrecoService.listarItens(tabelaId);
            setItems(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }

    async function handleSave() {
        if (!selectedGrupo) return;
        try {
            setLoading(true);
            const payload = {
                ...formData,
                grupoId: selectedGrupo.id,
                desconto: Number(formData.desconto)
            };

            if (selectedTabela && selectedTabela.id) {
                await tabelasPrecoService.atualizarTabela(selectedTabela.id, payload);
            } else {
                await tabelasPrecoService.criarTabela(payload);
            }

            await loadTabelas(selectedGrupo.id);
            setIsEditing(false);
            // If new, find it and select it? simplified: just reload list
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar tabela');
        } finally {
            setLoading(false);
        }
    }

    async function handleSyncItems() {
        if (!selectedTabela) return;
        try {
            setSyncing(true);
            await tabelasPrecoService.sincronizarItens(selectedTabela.id);
            await loadItens(selectedTabela.id);
            alert('Itens sincronizados com sucesso!');
        } catch (e) {
            console.error(e);
            alert('Erro ao sincronizar itens.');
        } finally {
            setSyncing(false);
        }
    }

    function handlePrepareNew() {
        setSelectedTabela({ id: null }); // Mock object for "new" state logic
        setFormData({
            id: '',
            nome: '',
            desconto: 0,
            atividadeCliente: '',
            ativo: true
        });
        setIsEditing(true);
        setActiveTab('GERAL');
    }

    return (
        <div className="p-6 h-screen flex flex-col bg-slate-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Gestão de Tabelas de Preço</h1>
                        <p className="text-slate-400 text-sm">Configure grupos, tabelas e preços</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Sidebar: Grupos e Lista de Tabelas */}
                <div className="w-1/3 flex flex-col gap-4">

                    {/* Seletor de Grupo */}
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Grupo de Tabelas</label>
                        <select
                            value={selectedGrupo?.id || ''}
                            onChange={e => setSelectedGrupo(grupos.find(g => g.id === e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Selecione um grupo...</option>
                            {grupos.map(g => (
                                <option key={g.id} value={g.id}>{g.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lista de Tabelas */}
                    <div className="bg-slate-800 flex-1 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 z-10">
                            <h3 className="font-semibold">Tabelas Disponíveis</h3>
                            <button onClick={handlePrepareNew} disabled={!selectedGrupo} className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors disabled:opacity-50">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {tabelas.length === 0 && <div className="text-center text-slate-500 p-4 font-light">Nenhuma tabela neste grupo</div>}
                            {tabelas.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setSelectedTabela(t)}
                                    className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedTabela?.id === t.id ? 'bg-indigo-600 border-indigo-500 shadow-lg' : 'bg-slate-700/50 border-transparent hover:bg-slate-700 hover:border-slate-600'}`}
                                >
                                    <div className="font-semibold">{t.nome}</div>
                                    <div className="text-xs text-slate-300 mt-1 flex justify-between">
                                        <span>{t.atividadeCliente || 'Geral'}</span>
                                        {Number(t.desconto) > 0 && <span className="text-emerald-300">-{t.desconto}%</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: Detalhes da Tabela */}
                <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
                    {!selectedTabela && !isEditing ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <Box className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg">Selecione uma tabela para visualizar</p>
                        </div>
                    ) : (
                        <>
                            {/* Tabs Header */}
                            <div className="flex border-b border-slate-700">
                                <button
                                    onClick={() => setActiveTab('GERAL')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'GERAL' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                                >
                                    Dados Gerais
                                </button>
                                <button
                                    onClick={() => setActiveTab('ITENS')}
                                    disabled={!selectedTabela?.id} // Disable items tab if creating new
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ITENS' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'} disabled:opacity-30 disabled:cursor-not-allowed`}
                                >
                                    Itens da Tabela
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="flex-1 overflow-y-auto p-6">

                                {activeTab === 'GERAL' && (
                                    <div className="max-w-2xl space-y-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Nome da Tabela</label>
                                                <input
                                                    type="text"
                                                    value={formData.nome}
                                                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                                    placeholder="Ex: Tabela Varejo 2024"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">Desconto Padrão (%)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={formData.desconto}
                                                            onChange={e => setFormData({ ...formData, desconto: Number(e.target.value) })}
                                                            disabled={!isEditing}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-3 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">Aplica-se a todos os itens se configurado.</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-400 mb-2">Atividade/Ramo do Cliente</label>
                                                    <input
                                                        type="text"
                                                        value={formData.atividadeCliente}
                                                        onChange={e => setFormData({ ...formData, atividadeCliente: e.target.value })}
                                                        disabled={!isEditing}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                                        placeholder="Ex: Supermercados, Padarias"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.ativo}
                                                        onChange={e => setFormData({ ...formData, ativo: e.target.checked })}
                                                        disabled={!isEditing}
                                                        className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 disabled:opacity-60"
                                                    />
                                                    <span className="text-sm font-medium text-white">Tabela Ativa</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4 pt-4 border-t border-slate-700">
                                            {!isEditing ? (
                                                <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Editar Dados
                                                </button>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setIsEditing(false); setSelectedTabela(selectedTabela); /* Reset */ }} className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                                                        Cancelar
                                                    </button>
                                                    <button onClick={handleSave} disabled={loading} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                                        {loading ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Alterações</>}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ITENS' && (
                                    <div className="h-full flex flex-col">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="font-bold text-lg">Itens e Precificação</h3>
                                                <p className="text-slate-400 text-sm">{items.length} produtos cadastrados nesta tabela</p>
                                            </div>
                                            <button
                                                onClick={handleSyncItems}
                                                disabled={syncing}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                                                {syncing ? 'Sincronizando...' : 'Atualizar Itens'}
                                            </button>
                                        </div>

                                        {items.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border border-dashed border-slate-700 p-8">
                                                <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                                                <h4 className="text-lg font-medium text-white mb-2">Nenhum item encontrado</h4>
                                                <p className="text-slate-400 text-center max-w-md mb-6">
                                                    Esta tabela ainda não possui produtos vinculados. Clique em "Atualizar Itens" para importar todos os produtos do cadastro.
                                                </p>
                                                <button onClick={handleSyncItems} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                                                    Sincronizar Agora
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-xs">
                                                        <tr>
                                                            <th className="p-4">Produto</th>
                                                            <th className="p-4">Preço Original</th>
                                                            <th className="p-4">Preço Tabela</th>
                                                            <th className="p-4 text-right">Ações</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800">
                                                        {items.map(item => (
                                                            <tr key={item.id} className="hover:bg-slate-800/50">
                                                                <td className="p-4 font-medium text-white">{item.produto?.nome || 'Produto ???'}</td>
                                                                <td className="p-4 text-slate-400">R$ {Number(item.produto?.precoVenda || 0).toFixed(2)}</td>
                                                                <td className="p-4 text-emerald-400 font-bold">R$ {Number(item.precoVenda).toFixed(2)}</td>
                                                                <td className="p-4 text-right">
                                                                    <button className="text-indigo-400 hover:text-indigo-300">Editar</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
