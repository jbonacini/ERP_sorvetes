import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, ArrowLeft } from 'lucide-react';
import { condicoesPagamentoService, db } from '../services/api';

interface CondicoesPagamentoScreenProps {
    onBack: () => void;
}

export function CondicoesPagamentoScreen({ onBack }: CondicoesPagamentoScreenProps) {
    const [condicoes, setCondicoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        ativo: true
    });

    const empresaId = db.empresaAtual?.id || '';

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const data = await condicoesPagamentoService.listar(empresaId);
            setCondicoes(data);
        } catch (error) {
            console.error('Erro ao carregar condições:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!formData.nome) return;
        try {
            await condicoesPagamentoService.criar({ ...formData, empresaId });
            setShowForm(false);
            setFormData({ nome: '', descricao: '', ativo: true });
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Condições de Pagamento</h1>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nova Condição
                </button>
            </div>

            {showForm && (
                <div className="mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-lg font-semibold text-white mb-4">Nova Condição</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Nome</label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                                placeholder="Ex: 30 Dias"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Descrição</label>
                            <input
                                type="text"
                                value={formData.descricao}
                                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                                placeholder="Ex: Pagamento em 30 dias corridos"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >
                            <Save className="w-4 h-4" />
                            Salvar
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-700/50 text-slate-400">
                        <tr>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Descrição</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {condicoes.map(c => (
                            <tr key={c.id} className="hover:bg-slate-700/30">
                                <td className="p-4 text-white font-medium">{c.nome}</td>
                                <td className="p-4 text-slate-400">{c.descricao || '-'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${c.ativo ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {c.ativo ? 'ATIVO' : 'INATIVO'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {condicoes.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Nenhuma condição cadastrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
