import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertTriangle, ArrowUpRight, ArrowDownLeft, FileText, ChevronRight } from 'lucide-react';
import { dbService } from '../services/api';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernInput } from './ui/ModernInput';
import { ModernButton } from './ui/ModernButton';

export function EstoqueScreen() {
    const [activeTab, setActiveTab] = useState<'PRODUTOS' | 'MOVIMENTACOES'>('PRODUTOS');
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // States para Formulário
    const [formData, setFormData] = useState({
        nome: '',
        codigo: '',
        tipo: 'PRODUTO_FINAL',
        unidade: 'UN',
        precoCusto: '',
        precoVenda: '',
        estoqueMinimo: '10',
        estoqueAtual: '0'
    });

    useEffect(() => {
        loadProdutos();
    }, []);

    const loadProdutos = async () => {
        setLoading(true);
        try {
            const empresa = dbService.getEmpresaData();
            if (empresa?.id) {
                const res = await dbService.produtosService.listar(empresa.id);
                setProdutos(res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutWrapper title="Estoque & Produtos" subtitle="Gerencie inventário, insumos e mercadorias">

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('PRODUTOS')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PRODUTOS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('MOVIMENTACOES')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'MOVIMENTACOES' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Movimentações
                    </button>
                </div>

                {activeTab === 'PRODUTOS' && (
                    <ModernButton onClick={() => setShowForm(true)} icon={Plus}>
                        Novo Produto
                    </ModernButton>
                )}
            </div>

            {/* Conteúdo Principal */}
            {activeTab === 'PRODUTOS' && (
                <div className="space-y-6">
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <GlassCard className="p-4" hoverEffect>
                            <p className="text-xs text-blue-200 uppercase font-bold">Total de Itens</p>
                            <p className="text-2xl font-bold text-white mt-1">{produtos.length}</p>
                        </GlassCard>
                        <GlassCard className="p-4" hoverEffect>
                            <p className="text-xs text-blue-200 uppercase font-bold">Valor em Estoque</p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1">R$ 0,00</p>
                        </GlassCard>
                        <GlassCard className="p-4" hoverEffect>
                            <p className="text-xs text-blue-200 uppercase font-bold">Estoque Baixo</p>
                            <p className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-2">0 <AlertTriangle size={16} /></p>
                        </GlassCard>
                    </div>

                    {/* Barra de Busca */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <ModernInput
                                placeholder="Buscar por nome, código..."
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-3.5 text-blue-200/50 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    <GlassCard className="p-0 overflow-hidden">
                        {produtos.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/30">
                                    <Package size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-white/70">Nenhum produto cadastrado</h3>
                                <p className="text-white/40 max-w-xs mx-auto mt-2 text-sm">Cadastre seus sorvetes, insumos e mercadorias para começar.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-white/90">
                                    <thead className="bg-white/10 border-b border-white/5 text-xs uppercase text-blue-100/70 font-bold">
                                        <tr>
                                            <th className="p-4 pl-6">Produto</th>
                                            <th className="p-4">Tipo</th>
                                            <th className="p-4">Unidade</th>
                                            <th className="p-4 text-right">Preço Venda</th>
                                            <th className="p-4 text-center">Estoque</th>
                                            <th className="p-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {produtos.map((p) => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                                <td className="p-4 pl-6">
                                                    <div className="font-bold text-white group-hover:text-indigo-200 transition-colors">{p.nome}</div>
                                                    <div className="text-xs text-white/50 font-mono bg-white/5 inline-block px-1.5 py-0.5 rounded mt-1">{p.codigo || 'S/N'}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/10 text-white/70 rounded-md border border-white/10">
                                                        {p.tipo === 'PRODUTO_FINAL' ? 'Produto Final' : p.tipo === 'INSUMO' ? 'Insumo' : 'Revenda'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-white/70">{p.unidade}</td>
                                                <td className="p-4 text-right font-mono text-sm font-bold text-white/90">
                                                    R$ {Number(p.precoVenda).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className={`inline-flex items-center gap-1 font-bold px-3 py-1 rounded-full text-xs border ${Number(p.estoqueAtual) <= Number(p.estoqueMinimo)
                                                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                        }`}>
                                                        {Number(p.estoqueAtual)}
                                                        {Number(p.estoqueAtual) <= Number(p.estoqueMinimo) && <AlertTriangle size={12} />}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Ativo"></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </GlassCard>
                </div>
            )}

            {activeTab === 'MOVIMENTACOES' && (
                <GlassCard className="p-12 text-center text-white/50">
                    <p>Histórico de entradas e saídas será exibido aqui.</p>
                </GlassCard>
            )}

            {/* Modal de Cadastro */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-2xl bg-slate-900/90 p-0 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white">Novo Produto</h2>
                            <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white transition-colors">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ModernInput
                                    label="Nome do Produto"
                                    placeholder="Ex: Sorvete de Flocos"
                                    value={formData.nome}
                                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                />
                                <ModernInput
                                    label="Código (SKU)"
                                    placeholder="Ex: SOR-FLO-10L"
                                    value={formData.codigo || ''}
                                    onChange={e => setFormData({ ...formData, codigo: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Tipo</label>
                                    <select
                                        value={formData.tipo}
                                        onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800"
                                    >
                                        <option value="PRODUTO_FINAL" className="bg-slate-800">Produto Final (Venda)</option>
                                        <option value="INSUMO" className="bg-slate-800">Matéria Prima (Insumo)</option>
                                        <option value="MERCADORIA_REVENDA" className="bg-slate-800">Revenda</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Unidade</label>
                                    <select
                                        value={formData.unidade}
                                        onChange={e => setFormData({ ...formData, unidade: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800"
                                    >
                                        <option value="UN" className="bg-slate-800">Unidade</option>
                                        <option value="KG" className="bg-slate-800">Quilo (kg)</option>
                                        <option value="L" className="bg-slate-800">Litro (l)</option>
                                        <option value="CX" className="bg-slate-800">Caixa</option>
                                    </select>
                                </div>
                                <ModernInput
                                    label="Estoque Min."
                                    type="number"
                                    value={formData.estoqueMinimo}
                                    onChange={e => setFormData({ ...formData, estoqueMinimo: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <ModernInput
                                    label="Preço de Custo"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.precoCusto}
                                    onChange={e => setFormData({ ...formData, precoCusto: e.target.value })}
                                />
                                <ModernInput
                                    label="Preço de Venda"
                                    type="number"
                                    placeholder="0.00"
                                    className="font-bold text-emerald-400"
                                    value={formData.precoVenda}
                                    onChange={e => setFormData({ ...formData, precoVenda: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-white/5 px-6 py-4 border-t border-white/10 flex justify-end gap-2">
                            <ModernButton variant="secondary" onClick={() => setShowForm(false)}>
                                Cancelar
                            </ModernButton>
                            <ModernButton
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const empresa = dbService.getEmpresaData();
                                        await dbService.produtosService.criar({
                                            ...formData,
                                            empresaId: empresa.id,
                                            precoCusto: Number(formData.precoCusto),
                                            precoVenda: Number(formData.precoVenda),
                                            estoqueMinimo: Number(formData.estoqueMinimo),
                                            estoqueAtual: 0
                                        });
                                        setShowForm(false);
                                        loadProdutos();
                                        setFormData({
                                            nome: '', tipo: 'PRODUTO_FINAL', unidade: 'UN',
                                            precoCusto: '', precoVenda: '', estoqueMinimo: '10', estoqueAtual: '0',
                                            codigo: ''
                                        });
                                    } catch (e) {
                                        console.error(e);
                                        alert('Erro ao salvar produto');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading || !formData.nome}
                                isLoading={loading}
                            >
                                Salvar Produto
                            </ModernButton>
                        </div>
                    </GlassCard>
                </div>
            )}
        </LayoutWrapper>
    );
}
