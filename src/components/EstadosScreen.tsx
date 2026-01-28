import React, { useState, useEffect } from 'react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { Search, Save, X, Edit, RotateCcw } from 'lucide-react';
import { api, db, operationalService, Estado } from '../services/api';

export function EstadosScreen() {
    const [estados, setEstados] = useState<Estado[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEstado, setEditingEstado] = useState<Estado | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadEstados();
    }, []);

    const loadEstados = async () => {
        setLoading(true);
        try {
            const data = await operationalService.listarEstados();
            setEstados(data);
        } catch (error) {
            console.error('Erro ao carregar estados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingEstado) return;
        try {
            await operationalService.atualizarEstado(editingEstado.id, editingEstado);
            setEditingEstado(null);
            loadEstados();
            alert('Estado atualizado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar estado.');
        }
    };

    const filteredEstados = estados.filter(e =>
        e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.sigla.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <LayoutWrapper title="Gestão de Estados e Tributação" subtitle="Configuração de alíquotas de ICMS por UF">
            {!editingEstado ? (
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                            <ModernInput
                                placeholder="Buscar estado..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/5 text-white/60 text-sm font-medium text-left">
                                <tr>
                                    <th className="p-4 w-16">Sigla</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-center w-32">ICMS Interno (%)</th>
                                    <th className="p-4 text-center w-32">ICMS Externo (%)</th>
                                    <th className="p-4 text-right w-24">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-white/50">Carregando...</td></tr>
                                ) : filteredEstados.map(estado => (
                                    <tr key={estado.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-bold">{estado.sigla}</td>
                                        <td className="p-4">{estado.nome}</td>
                                        <td className="p-4 text-center">{estado.icmsInterno}%</td>
                                        <td className="p-4 text-center">{estado.icmsInterestadual}%</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setEditingEstado(estado)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                                                title="Editar Alíquotas"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Edit className="text-blue-400" />
                            Editar Estado: {editingEstado.nome} ({editingEstado.sigla})
                        </h2>
                        <button onClick={() => setEditingEstado(null)} className="text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="col-span-1">
                            <label className="text-sm text-white/60 mb-1 block">ICMS Interno (%)</label>
                            <ModernInput
                                type="number"
                                value={editingEstado.icmsInterno}
                                onChange={e => setEditingEstado({ ...editingEstado, icmsInterno: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="text-sm text-white/60 mb-1 block">ICMS Interestadual (%)</label>
                            <ModernInput
                                type="number"
                                value={editingEstado.icmsInterestadual}
                                onChange={e => setEditingEstado({ ...editingEstado, icmsInterestadual: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <ModernButton variant="outline" onClick={() => setEditingEstado(null)}>
                            Cancelar
                        </ModernButton>
                        <ModernButton onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                            <Save size={18} className="mr-2" />
                            Salvar Alterações
                        </ModernButton>
                    </div>
                </div>
            )}
        </LayoutWrapper>
    );
}
