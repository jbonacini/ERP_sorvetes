import { useState, useEffect } from 'react';
import {
    ShoppingCart, Plus, Search, Filter, Trash2, Save,
    User, FileText, ChevronRight, Calculator
} from 'lucide-react';
import { dbService, tabelasPrecoService, condicoesPagamentoService, db } from '../services/api';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernInput } from './ui/ModernInput';
import { ModernButton } from './ui/ModernButton';

export function VendasScreen({ embedded = false }: { embedded?: boolean }) {
    // States
    const [view, setView] = useState<'LISTA' | 'NOVO_PEDIDO'>('LISTA');
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [condicoesPagamento, setCondicoesPagamento] = useState<any[]>([]);
    const [tabelasPreco, setTabelasPreco] = useState<any[]>([]);

    // Selection State
    const [tabelaSelecionadaId, setTabelaSelecionadaId] = useState('');
    const [loading, setLoading] = useState(false);

    // Form Pedido State
    const [pedido, setPedido] = useState({
        clienteId: '',
        itens: [] as any[],
        observacoes: '',
        condicaoPagamentoId: '',
        formaPagamento: 'DINHEIRO', // Manter compatibilidade com backend antigo se tiver
        descontoGeral: 0
    });

    const [itemTemp, setItemTemp] = useState({
        produtoId: '',
        quantidade: 1,
        precoUnitario: 0,
        desconto: 0
    });

    // Load Initial Data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const empresaId = db.empresaAtual?.id;
            if (!empresaId) return;

            const [pedidos, clientes, produtos, condicoes, grupos] = await Promise.all([
                dbService.pedidosService.listar(empresaId),
                dbService.operationalService.listarClientes(),
                dbService.produtosService.listar(empresaId),
                condicoesPagamentoService ? condicoesPagamentoService.listar(empresaId) : [],
                tabelasPrecoService ? tabelasPrecoService.listarGrupos(empresaId) : []
            ]);

            setPedidos(pedidos);
            setClientes(clientes);
            setProdutos(produtos);
            setCondicoesPagamento(condicoes);

            const allTables: any[] = [];
            if (tabelasPrecoService) {
                for (const g of grupos) {
                    const tabs = await tabelasPrecoService.listarTabelas(g.id);
                    allTables.push(...tabs);
                }
            }
            setTabelasPreco(allTables);

        } catch (error) {
            console.error("Erro ao carregar dados", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-select table based on client
    useEffect(() => {
        if (pedido.clienteId && clientes.length > 0) {
            // const cli = clientes.find(c => c.id === pedido.clienteId);
            // Lógica futura de tabela automática
        }
    }, [pedido.clienteId]);

    // Handlers
    const handleAddItem = async () => {
        if (!itemTemp.produtoId || itemTemp.quantidade <= 0) return;

        let precoFinal = itemTemp.precoUnitario;

        // If table selected, try to find price
        if (tabelaSelecionadaId && tabelasPrecoService) {
            const itensTabela = await tabelasPrecoService.listarItens(tabelaSelecionadaId);
            const itemTab = itensTabela.find(i => i.produtoId === itemTemp.produtoId);
            if (itemTab) precoFinal = Number(itemTab.precoVenda);
        }

        const produto = produtos.find(p => p.id === itemTemp.produtoId);
        if (!produto) return;

        const newItem = {
            ...itemTemp,
            precoUnitario: precoFinal,
            nomeProduto: produto.nome,
            total: (itemTemp.quantidade * precoFinal) - itemTemp.desconto
        };

        setPedido(prev => ({
            ...prev,
            itens: [...prev.itens, newItem]
        }));

        // Reset Item Temp
        setItemTemp({
            produtoId: '',
            quantidade: 1,
            precoUnitario: 0,
            desconto: 0
        });
    };

    const handleRemoveItem = (index: number) => {
        setPedido(prev => ({
            ...prev,
            itens: prev.itens.filter((_, i) => i !== index)
        }));
    };

    const calculateTotal = () => {
        const subtotal = pedido.itens.reduce((acc, item) => acc + item.total, 0);
        return subtotal - pedido.descontoGeral;
    };

    const handleSavePedido = async () => {
        if (!pedido.clienteId || pedido.itens.length === 0) {
            alert("Selecione um cliente e adicione itens.");
            return;
        }

        setLoading(true);
        try {
            const empresa = dbService.getEmpresaData();
            await dbService.pedidosService.criar({
                empresaId: empresa.id,
                ...pedido,
                status: 'ORCAMENTO'
            });
            setView('LISTA');
            loadData();
            setPedido({
                clienteId: '',
                itens: [],
                observacoes: '',
                condicaoPagamentoId: '',
                formaPagamento: 'DINHEIRO',
                descontoGeral: 0
            });
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar pedido");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---

    if (view === 'NOVO_PEDIDO') {
        return (
            <LayoutWrapper
                title="Novo Pedido de Venda"
                onBack={() => setView('LISTA')}
                embedded={embedded}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coluna Esquerda: Dados e Itens */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Selecionar Cliente */}
                        <GlassCard>
                            <h3 className="text-sm font-bold text-blue-100 uppercase mb-4 flex items-center gap-2">
                                <User size={16} /> Cliente
                            </h3>
                            <select
                                value={pedido.clienteId}
                                onChange={e => setPedido({ ...pedido, clienteId: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800"
                            >
                                <option value="" className="bg-slate-800 text-gray-400">Selecione um cliente...</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id} className="bg-slate-800">{c.nomeFantasia || c.nome}</option>
                                ))}
                            </select>
                        </GlassCard>

                        {/* Adicionar Itens */}
                        <GlassCard>
                            <h3 className="text-sm font-bold text-blue-100 uppercase mb-4 flex items-center gap-2">
                                <ShoppingCart size={16} /> Itens do Pedido
                            </h3>

                            {/* Form Item */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Produto</label>
                                    <select
                                        value={itemTemp.produtoId}
                                        onChange={e => {
                                            const prod = produtos.find(p => p.id === e.target.value);
                                            setItemTemp({
                                                ...itemTemp,
                                                produtoId: e.target.value,
                                                precoUnitario: prod ? Number(prod.precoVenda) : 0
                                            });
                                        }}
                                        className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none option:bg-slate-800"
                                    >
                                        <option value="" className="bg-slate-800">Selecione...</option>
                                        {produtos.map(p => (
                                            <option key={p.id} value={p.id} className="bg-slate-800">{p.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Qtd</label>
                                    <input
                                        type="number"
                                        value={itemTemp.quantidade}
                                        onChange={e => setItemTemp({ ...itemTemp, quantidade: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none"
                                        min="1"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Preço Unit.</label>
                                    <input
                                        type="number"
                                        value={itemTemp.precoUnitario}
                                        onChange={e => setItemTemp({ ...itemTemp, precoUnitario: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <ModernButton
                                        onClick={handleAddItem}
                                        icon={Plus}
                                        className="py-2 px-3 h-[42px]"
                                    />
                                </div>
                            </div>

                            {/* Lista de Itens Adicionados */}
                            <div className="overflow-x-auto rounded-xl border border-white/5">
                                <table className="w-full text-left text-sm text-white/80">
                                    <thead className="bg-white/10 text-blue-100/70">
                                        <tr>
                                            <th className="p-3 font-medium">Produto</th>
                                            <th className="p-3 text-right font-medium">Qtd</th>
                                            <th className="p-3 text-right font-medium">Unitário</th>
                                            <th className="p-3 text-right font-medium">Total</th>
                                            <th className="p-3 text-center font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {pedido.itens.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                <td className="p-3">{item.nomeProduto}</td>
                                                <td className="p-3 text-right font-mono">{item.quantidade}</td>
                                                <td className="p-3 text-right font-mono">R$ {item.precoUnitario.toFixed(2)}</td>
                                                <td className="p-3 text-right font-bold text-emerald-400 font-mono">R$ {item.total.toFixed(2)}</td>
                                                <td className="p-3 text-center">
                                                    <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-300 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {pedido.itens.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-6 text-center text-white/30 italic">
                                                    Nenhum item adicionado ainda.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>

                    </div>

                    {/* Coluna Direita: Totais e Opções */}
                    <div className="space-y-6">
                        <GlassCard className="sticky top-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Calculator size={20} className="text-indigo-400" /> Resumo
                            </h3>

                            {/* SELECTOR DE TABELA DE PREÇO E CONDIÇÃO */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                                <div>
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Tabela de Preço</label>
                                    <select
                                        className="w-full p-2 border border-white/10 rounded-lg bg-black/20 text-white text-sm focus:outline-none option:bg-slate-800"
                                        value={tabelaSelecionadaId}
                                        onChange={e => setTabelaSelecionadaId(e.target.value)}
                                    >
                                        <option value="" className="bg-slate-800">Padrão (Sem tabela)</option>
                                        {tabelasPreco.map(t => (
                                            <option key={t.id} value={t.id} className="bg-slate-800">{t.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Forma de Pagamento</label>
                                    <select
                                        value={pedido.condicaoPagamentoId || ''}
                                        onChange={e => setPedido({ ...pedido, condicaoPagamentoId: e.target.value })}
                                        className="w-full p-2 border border-white/10 rounded-lg bg-black/20 text-white text-sm focus:outline-none option:bg-slate-800"
                                    >
                                        <option value="" className="bg-slate-800">Selecione...</option>
                                        {condicoesPagamento.map(c => (
                                            <option key={c.id} value={c.id} className="bg-slate-800">{c.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 font-mono text-sm">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span>R$ {pedido.itens.reduce((acc, i) => acc + i.total, 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/70 items-center">
                                    <span>Desconto</span>
                                    <input
                                        type="number"
                                        value={pedido.descontoGeral}
                                        onChange={e => setPedido({ ...pedido, descontoGeral: Number(e.target.value) })}
                                        className="w-24 text-right p-1 border border-white/10 bg-black/20 rounded text-white focus:outline-none"
                                    />
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between text-xl font-bold text-emerald-400">
                                    <span>TOTAL</span>
                                    <span>R$ {calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-blue-200 uppercase mb-1 block">Observações</label>
                                    <textarea
                                        value={pedido.observacoes}
                                        onChange={e => setPedido({ ...pedido, observacoes: e.target.value })}
                                        className="w-full p-2 border border-white/10 rounded-lg bg-black/20 text-white text-sm h-24 resize-none focus:outline-none"
                                        placeholder="Ex: Entrega agendada para sexta-feira..."
                                    />
                                </div>
                            </div>

                            <ModernButton
                                onClick={handleSavePedido}
                                isLoading={loading}
                                className="w-full mt-4"
                                icon={Save}
                            >
                                Salvar Pedido
                            </ModernButton>

                        </GlassCard>
                    </div>
                </div>
            </LayoutWrapper>
        );
    }

    // LIST VIEW
    return (
        <LayoutWrapper title="Pedidos de Venda" subtitle="Gerencie orçamentos e vendas" embedded={embedded}>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-96 flex gap-2">
                    <div className="relative flex-1">
                        <ModernInput
                            placeholder="Buscar por cliente ou número..."
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-3.5 text-blue-200/50 pointer-events-none" size={18} />
                    </div>
                    <ModernButton variant="secondary" icon={Filter}>
                        Filtros
                    </ModernButton>
                </div>

                <ModernButton
                    onClick={() => setView('NOVO_PEDIDO')}
                    icon={Plus}
                >
                    Novo Pedido
                </ModernButton>
            </div>

            {/* Tabela de Pedidos */}
            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-white/90">
                        <thead className="bg-white/10 border-b border-white/5 text-xs uppercase text-blue-100/70 font-semibold tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Número</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Total</th>
                                <th className="p-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-white/40 gap-4">
                                            <FileText size={48} className="opacity-50" />
                                            <p>Nenhum pedido encontrado. Crie o primeiro!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                        <td className="p-4 pl-6 font-mono text-indigo-300">#{p.numero.toString().padStart(4, '0')}</td>
                                        <td className="p-4 font-bold text-white group-hover:text-indigo-200 transition-colors">{p.cliente.nomeFantasia || p.cliente.nome}</td>
                                        <td className="p-4 text-sm text-white/60">{new Date(p.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${p.status === 'APROVADO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                                p.status === 'ORCAMENTO' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-emerald-400 font-mono">R$ {Number(p.valorTotal).toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <button className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </LayoutWrapper>
    );
}
