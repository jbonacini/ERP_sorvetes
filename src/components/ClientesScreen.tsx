import { useState, useEffect } from 'react';
import { dbService, areasComerciaisService, tabelasPrecoService, db, condicoesPagamentoService, comissoesService, logisticaService, operationalService, Estado } from '../services/api';
import { Cliente } from '../types';
import { Users, Plus, Pencil, Trash2, MapPin, Search, Save, FileText, Phone, Info, Check, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernInput } from './ui/ModernInput';
import { ModernButton } from './ui/ModernButton';
import { GlassSidebar } from './ui/GlassSidebar';
import { MenuItem } from '../config/operationalMenu';



export function ClientesScreen({ embedded = false }: { embedded?: boolean }) {
    const clientFormMenu: MenuItem[] = [
        { id: 'GERAL', label: 'Dados Gerais', icon: FileText },
        { id: 'ENDERECO', label: 'Endereço', icon: MapPin },
        { id: 'CONTATO', label: 'Contatos', icon: Phone },
        {
            id: 'INFO', label: 'Info. Compl.', icon: Info,
            children: [
                { id: 'INFO_CARTEIRA', label: 'Carteira Comercial' },
                { id: 'INFO_COND_PAGTO', label: 'Condição de Pagamento' },
                { id: 'INFO_ROTEIRO', label: 'Roteiro de Atendimento' },
                { id: 'INFO_COMISSAO', label: 'Perfil de Comissão' },
                { id: 'INFO_COMPLEMENTO', label: 'Complemento' },
            ]
        },
    ];

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [areas, setAreas] = useState<any[]>([]);
    const [gruposPreco, setGruposPreco] = useState<any[]>([]);
    const [condicoesPagamento, setCondicoesPagamento] = useState<any[]>([]);
    const [perfisComissao, setPerfisComissao] = useState<any[]>([]);
    const [rotas, setRotas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCliente, setEditingCliente] = useState<Partial<Cliente> | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('GERAL');
    const [loadingCep, setLoadingCep] = useState(false);
    const [loadingDocumento, setLoadingDocumento] = useState(false);

    const empresaId = db.empresaAtual?.id;

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        if (editingCliente) {
            gsap.from(".modal-content", { y: -50, opacity: 0, duration: 0.3 });
        }
    }, [editingCliente]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [clientesData, areasData, gruposData, condicoesData, perfisData, rotasData] = await Promise.all([
                dbService.operationalService.listarClientes(),
                areasComerciaisService ? areasComerciaisService.listar(empresaId || '') : Promise.resolve([]),
                tabelasPrecoService ? tabelasPrecoService.listarGrupos(empresaId || '') : Promise.resolve([]),
                condicoesPagamentoService.listar(empresaId || ''),
                comissoesService.listarPerfis(empresaId || ''),
                logisticaService.listarRotas()
            ]);
            setClientes(clientesData);
            setAreas(areasData);
            setGruposPreco(gruposData);
            setCondicoesPagamento(condicoesData);
            setPerfisComissao(perfisData);
            setRotas(rotasData);
        } catch (e) {
            console.error("Erro ao carregar clientes/dados auxiliares", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingCliente?.nomeFantasia || !editingCliente.documento) return alert('Preencha os campos obrigatórios');

        try {
            const payload = {
                ...editingCliente,
                empresaId: empresaId,
                tipo: editingCliente.tipo || 'PF',
                cpfCnpj: editingCliente.documento, // Mapeamento para o Backend
                status: editingCliente.status || 'ATIVO',
                endereco: editingCliente.endereco || {
                    cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '', ibge: '',
                    pais: 'Brasil', tipoEndereco: 'COMERCIAL'
                }
            };

            if (editingCliente.id) {
                await dbService.operationalService.atualizarCliente(editingCliente.id, payload);
            } else {
                await dbService.operationalService.criarCliente(payload as any);
            }
            setEditingCliente(null);
            carregarDados();
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar cliente');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await dbService.operationalService.removerCliente(id);
                // Otimistic update or reload
                carregarDados();
            } catch (e) {
                console.error(e);
                alert('Erro ao excluir cliente');
            }
        }
    };

    const [listaEstados, setListaEstados] = useState<Estado[]>([]);

    useEffect(() => {
        carregarDados();
        loadEstados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadEstados = async () => {
        try {
            const states = await operationalService.listarEstados();
            setListaEstados(states);
        } catch (e) { console.error('Erro ao carregar estados', e); }
    };

    const handleCepBlur = async (e: any) => {
        // Se for evento do input blur, pegar o value, senão usar do state
        const cepValue = e?.target?.value || editingCliente?.endereco?.cep;
        if (!cepValue) return;

        const cep = cepValue.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setLoadingCep(true);
        try {
            const data = await operationalService.buscarCep(cep);
            if (data) {
                setEditingCliente(prev => ({
                    ...prev!,
                    endereco: {
                        ...prev!.endereco!,
                        logradouro: data.logradouro || prev!.endereco!.logradouro,
                        bairro: data.bairro || prev!.endereco!.bairro,
                        cidade: data.cidade || prev!.endereco!.cidade,
                        uf: data.uf || prev!.endereco!.uf,
                    }
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP", error);
        } finally {
            setLoadingCep(false);
        }
    };

    const handleDocumentoBlur = async () => {
        if (!editingCliente?.documento) return;
        const doc = editingCliente.documento.replace(/\D/g, '');
        if (doc.length !== 14) return; // Only CNPJ for now

        setLoadingDocumento(true);
        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${doc}`);
            if (response.ok) {
                const data = await response.json();
                setEditingCliente(prev => ({
                    ...prev!,
                    nomeFantasia: data.nome_fantasia || data.razao_social || prev!.nomeFantasia,
                    razaoSocial: data.razao_social || prev!.razaoSocial,
                    // If API returns address, we can use it, but be careful not to overwrite if user already has data
                    telefone: data.ddd_telefone_1 ? `${data.ddd_telefone_1}${data.telefone1 || ''}` : prev!.telefone,
                    email: data.email || prev!.email,
                    // Map Simples Nacional status
                    regimeTributario: data.opcao_pelo_simples ? 'SIMPLES_NACIONAL' : (prev!.regimeTributario || undefined),
                    // BrasilAPI might not return IE, but we set structure.
                    endereco: {
                        ...prev!.endereco!,
                        cep: data.cep ? data.cep.replace(/\D/g, '') : prev!.endereco!.cep,
                        logradouro: data.logradouro || prev!.endereco!.logradouro,
                        numero: data.numero || prev!.endereco!.numero,
                        bairro: data.bairro || prev!.endereco!.bairro,
                        cidade: data.municipio || prev!.endereco!.cidade,
                        uf: data.uf || prev!.endereco!.uf,
                        complemento: data.complemento || prev!.endereco!.complemento
                    }
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CNPJ", error);
        } finally {
            setLoadingDocumento(false);
        }
    };

    const filteredClientes = clientes.filter(c =>
        (c.nomeFantasia || c.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.documento.includes(searchTerm)
    );

    return (
        <LayoutWrapper title="Gestão de Clientes" subtitle="Cadastre e gerencie sua carteira de clientes" embedded={embedded} hideHeader={!!editingCliente} noPadding={!!editingCliente}>

            {editingCliente ? (
                <div className="flex h-full w-full bg-slate-900/50 backdrop-blur-sm absolute inset-0 z-50 overflow-hidden">
                    {/* Sidebar Interna do Form */}
                    <div className="h-full shrink-0 border-r border-white/10 bg-slate-900/80">
                        <GlassSidebar
                            items={clientFormMenu}
                            activeItem={activeTab}
                            onSelect={(item) => setActiveTab(item.id)}
                            onBack={() => setEditingCliente(null)}
                            logoTitle={editingCliente.id ? 'Editar Cliente' : 'Novo Cliente'}
                            logoSubtitle="Preencha os dados"
                            className="h-full w-64 rounded-none border-none shadow-none bg-transparent"
                        />
                    </div>

                    {/* Área de Conteúdo do Formulário */}
                    <div className="flex-1 h-full overflow-y-auto custom-scrollbar p-6 bg-slate-900/40 relative">
                        <div className="max-w-5xl mx-auto space-y-6 pb-20">

                            {/* Header da Aba */}
                            <div className="flex justify-between items-center mb-2 sticky top-0 bg-slate-900/90 p-4 rounded-xl backdrop-blur-md z-10 border border-white/5 shadow-lg">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    {(() => {
                                        const findItem = (items: MenuItem[], id: string): MenuItem | undefined => {
                                            for (const item of items) {
                                                if (item.id === id) return item;
                                                if (item.children) {
                                                    const found = findItem(item.children, id);
                                                    if (found) return found;
                                                }
                                            }
                                            return undefined;
                                        };
                                        const item = findItem(clientFormMenu, activeTab);
                                        const Icon = item?.icon || (activeTab.startsWith('INFO_') ? Info : FileText);

                                        return (
                                            <>
                                                <div className="p-2 bg-indigo-500/20 rounded-lg"><Icon className="text-indigo-400" size={20} /></div>
                                                <span>{item?.label}</span>
                                            </>
                                        );
                                    })()}
                                </h2>
                                <div className="flex gap-2">
                                    <ModernButton variant="ghost" className="text-white/60 hover:text-white" onClick={() => setEditingCliente(null)}>Cancelar</ModernButton>
                                    <ModernButton onClick={handleSave} icon={Save} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 shadow-lg border-indigo-500/50">Salvar Alterações</ModernButton>
                                </div>
                            </div>

                            {/* Conteúdo das Abas */}
                            {activeTab === 'GERAL' && (
                                <GlassCard className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-blue-100 mb-2">Tipo de Pessoa</label>
                                            <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${editingCliente.tipo === 'PF' ? 'bg-indigo-600/80 text-white shadow-lg ring-1 ring-indigo-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                                                    <input type="radio" className="hidden" name="tipo" checked={editingCliente.tipo === 'PF'} onChange={() => setEditingCliente(prev => ({ ...prev!, tipo: 'PF' }))} />
                                                    <span>Pessoa Física</span>
                                                </label>
                                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${editingCliente.tipo === 'PJ' ? 'bg-indigo-600/80 text-white shadow-lg ring-1 ring-indigo-400' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                                                    <input type="radio" className="hidden" name="tipo" checked={editingCliente.tipo === 'PJ'} onChange={() => setEditingCliente(prev => ({ ...prev!, tipo: 'PJ' }))} />
                                                    <span>Pessoa Jurídica</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="block text-sm font-medium text-blue-100">Relacionamentos (Papéis)</label>
                                                {editingCliente.papeis && editingCliente.papeis.length > 0 && <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Relacionamento Ativo</span>}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {['CLIENTE', 'FORNECEDOR', 'FUNCIONARIO', 'VENDEDOR', 'MOTORISTA', 'TRANSPORTADORA'].map(role => {
                                                    const isActive = editingCliente.papeis?.includes(role as any);
                                                    return (
                                                        <button
                                                            key={role}
                                                            onClick={() => {
                                                                const currentRoles = editingCliente.papeis || [];
                                                                const newRoles = isActive
                                                                    ? currentRoles.filter(r => r !== role)
                                                                    : [...currentRoles, role];
                                                                setEditingCliente({ ...editingCliente, papeis: newRoles as any });
                                                            }}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'bg-transparent text-white/50 border-white/10 hover:bg-white/5'}`}
                                                        >
                                                            {isActive && <Check size={14} />}
                                                            {role}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <ModernInput
                                                label="Nome Fantasia"
                                                value={editingCliente.nomeFantasia || ''}
                                                onChange={e => setEditingCliente({ ...editingCliente, nomeFantasia: e.target.value })}
                                                placeholder="Ex: Sorveteria do João"
                                            />
                                            <div className="mt-4">
                                                <ModernInput
                                                    label="Razão Social"
                                                    value={editingCliente.razaoSocial || ''}
                                                    onChange={e => setEditingCliente({ ...editingCliente, razaoSocial: e.target.value })}
                                                    placeholder="Ex: João da Silva Ltda"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ModernInput
                                                label={editingCliente.tipo === 'PF' ? 'CPF' : 'CNPJ'}
                                                value={editingCliente.documento || ''}
                                                onChange={e => setEditingCliente({ ...editingCliente, documento: e.target.value })}
                                                placeholder={editingCliente.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'}
                                                onBlur={handleDocumentoBlur}
                                                icon={loadingDocumento ? <Loader2 className="animate-spin text-indigo-400" size={16} /> : undefined}
                                            />

                                            {editingCliente.tipo === 'PF' ? (
                                                <ModernInput
                                                    label="RG"
                                                    value={editingCliente.rg || ''}
                                                    onChange={e => setEditingCliente({ ...editingCliente, rg: e.target.value })}
                                                    placeholder="00.000.000-0"
                                                />
                                            ) : (
                                                <ModernInput
                                                    label="Inscrição Estadual"
                                                    value={editingCliente.inscricaoEstadual || ''}
                                                    onChange={e => setEditingCliente({ ...editingCliente, inscricaoEstadual: e.target.value })}
                                                    placeholder="Isento ou Número"
                                                />
                                            )}
                                        </div>

                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                            <div className="flex flex-col gap-2">
                                                <label className="block text-sm font-medium text-blue-100">Contribuinte ICMS?</label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={editingCliente.contribuinte === true}
                                                            onChange={() => setEditingCliente({ ...editingCliente, contribuinte: true })}
                                                            className="text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-white/10"
                                                        />
                                                        <span className="text-white/80">Sim</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={editingCliente.contribuinte === false || editingCliente.contribuinte === undefined}
                                                            onChange={() => setEditingCliente({ ...editingCliente, contribuinte: false })}
                                                            className="text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-white/10"
                                                        />
                                                        <span className="text-white/80">Não</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {editingCliente.tipo === 'PJ' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-100 mb-1.5 ml-1">Regime Tributário</label>
                                                    <select
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800"
                                                        value={editingCliente.regimeTributario || ''}
                                                        onChange={e => setEditingCliente({ ...editingCliente, regimeTributario: e.target.value as any })}
                                                        aria-label="Regime Tributário"
                                                    >
                                                        <option value="" className="bg-slate-800">Selecione...</option>
                                                        <option value="SIMPLES_NACIONAL" className="bg-slate-800">Simples Nacional</option>
                                                        <option value="LUCRO_PRESUMIDO" className="bg-slate-800">Lucro Presumido</option>
                                                        <option value="LUCRO_REAL" className="bg-slate-800">Lucro Real</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        <div className="hidden md:block"></div> { /* Spacer */}


                                    </div>
                                </GlassCard>
                            )}

                            {activeTab === 'ENDERECO' && (
                                <GlassCard className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1">
                                                <label className="block text-sm font-medium text-blue-100 mb-1.5 ml-1">Tipo de Endereço</label>
                                                <select
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800"
                                                    value={editingCliente.endereco?.tipoEndereco || 'COMERCIAL'}
                                                    onChange={e => setEditingCliente({
                                                        ...editingCliente,
                                                        endereco: { ...editingCliente.endereco!, tipoEndereco: e.target.value as any }
                                                    })}
                                                    aria-label="Tipo de Endereço"
                                                >
                                                    <option value="COMERCIAL" className="bg-slate-800">Comercial</option>
                                                    <option value="RESIDENCIAL" className="bg-slate-800">Residencial</option>
                                                    <option value="ENTREGA" className="bg-slate-800">Entrega</option>
                                                    <option value="COBRANCA" className="bg-slate-800">Cobrança</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <ModernInput
                                                    label="Descrição (Opcional)"
                                                    value={editingCliente.endereco?.descricao || ''}
                                                    onChange={e => setEditingCliente({
                                                        ...editingCliente,
                                                        endereco: { ...editingCliente.endereco!, descricao: e.target.value }
                                                    })}
                                                    placeholder="Ex: Matriz, Centro de Distribuição..."
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <ModernInput
                                                label="CEP"
                                                value={editingCliente.endereco?.cep || ''}
                                                onChange={e => setEditingCliente({
                                                    ...editingCliente,
                                                    endereco: { ...editingCliente.endereco!, cep: e.target.value }
                                                })}
                                                // placeholder="00000-000"
                                                placeholder="00000-000"
                                                onBlur={handleCepBlur}
                                                icon={loadingCep ? <Loader2 className="animate-spin text-indigo-400" size={16} /> : undefined}
                                            />
                                            <div className="md:col-span-2">
                                                <ModernInput
                                                    label="País"
                                                    value={editingCliente.endereco?.pais || 'Brasil'}
                                                    onChange={e => setEditingCliente({
                                                        ...editingCliente,
                                                        endereco: { ...editingCliente.endereco!, pais: e.target.value }
                                                    })}
                                                    placeholder="Brasil"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[1fr_120px] gap-6">
                                        <ModernInput
                                            label="Logradouro"
                                            value={editingCliente.endereco?.logradouro || ''}
                                            onChange={e => setEditingCliente({
                                                ...editingCliente,
                                                endereco: { ...editingCliente.endereco!, logradouro: e.target.value }
                                            })}
                                            placeholder="Rua, Avenida, Travessa..."
                                        />
                                        <ModernInput
                                            label="Número"
                                            value={editingCliente.endereco?.numero || ''}
                                            onChange={e => setEditingCliente({
                                                ...editingCliente,
                                                endereco: { ...editingCliente.endereco!, numero: e.target.value }
                                            })}
                                        />
                                    </div>

                                    <ModernInput
                                        label="Complemento"
                                        value={editingCliente.endereco?.complemento || ''}
                                        onChange={e => setEditingCliente({
                                            ...editingCliente,
                                            endereco: { ...editingCliente.endereco!, complemento: e.target.value }
                                        })}
                                        placeholder="Apto, Bloco, Sala..."
                                    />

                                    <ModernInput
                                        label="Bairro"
                                        value={editingCliente.endereco?.bairro || ''}
                                        onChange={e => setEditingCliente({
                                            ...editingCliente,
                                            endereco: { ...editingCliente.endereco!, bairro: e.target.value }
                                        })}
                                    />

                                    <div className="grid grid-cols-[1fr_80px] gap-6">
                                        <ModernInput
                                            label="Cidade"
                                            value={editingCliente.endereco?.cidade || ''}
                                            onChange={e => setEditingCliente({
                                                ...editingCliente,
                                                endereco: { ...editingCliente.endereco!, cidade: e.target.value }
                                            })}
                                        />
                                        <div className="md:col-span-1">
                                            <label className="text-sm font-medium text-blue-200 ml-1 block mb-1">UF</label>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                value={editingCliente.endereco?.uf || ''}
                                                onChange={e => setEditingCliente({
                                                    ...editingCliente,
                                                    endereco: { ...editingCliente.endereco!, uf: e.target.value }
                                                })}
                                            >
                                                <option value="">UF</option>
                                                {listaEstados.map(uf => (
                                                    <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-end pb-1">
                                        <ModernButton
                                            variant="ghost"
                                            onClick={() => {
                                                // Mock de busca de coordenadas
                                                // Em produção, usar API do Google Maps ou Bing Maps
                                                if (!editingCliente.endereco?.cep) return alert("Preencha o CEP primeiro.");

                                                // Simulação baseada em "Franca-SP" (cidade do usuário)
                                                setEditingCliente({
                                                    ...editingCliente,
                                                    endereco: {
                                                        ...editingCliente.endereco!,
                                                        latitude: -20.5386,
                                                        longitude: -47.4008
                                                    }
                                                });
                                            }}
                                            className="text-xs h-8 px-3 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20"
                                        >
                                            <MapPin size={14} className="mr-1" /> Buscar Coordenadas
                                        </ModernButton>
                                    </div>
                                </GlassCard>
                            )}

                            {activeTab === 'CONTATO' && (
                                <GlassCard className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ModernInput
                                            label="Telefone Principal"
                                            value={editingCliente.telefone || ''}
                                            onChange={e => setEditingCliente({ ...editingCliente, telefone: e.target.value })}
                                            icon={<Phone size={16} className="text-white/40" />}
                                        />
                                        <ModernInput
                                            label="E-mail Principal"
                                            type="email"
                                            value={editingCliente.email || ''}
                                            onChange={e => setEditingCliente({ ...editingCliente, email: e.target.value })}
                                            placeholder="contato@empresa.com"
                                        />
                                    </div>

                                    <div className="relative p-8 mt-8 border border-white/5 rounded-2xl bg-white/5 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                                            <Users className="text-indigo-400" size={32} />
                                        </div>
                                        <h3 className="text-lg font-medium text-white mb-2">Contatos Adicionais</h3>
                                        <p className="text-white/50 max-w-sm mb-6">Cadastre contatos secundários como Financeiro, Compras ou Gerência.</p>
                                        <ModernButton variant="secondary" icon={Plus}>Adicionar Contato</ModernButton>
                                    </div>
                                </GlassCard>
                            )}

                            {activeTab.startsWith('INFO_') && (
                                <GlassCard className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                                            <Info className="text-indigo-400" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">Informações Complementares</h3>
                                            <p className="text-sm text-white/50">{
                                                clientFormMenu.find(i => i.id === 'INFO')?.children?.find(c => c.id === activeTab)?.label
                                            }</p>
                                        </div>
                                    </div>

                                    {activeTab === 'INFO_CARTEIRA' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-400 font-medium mb-1 block">Carteira Comercial / Área</label>
                                                    <select
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                        value={editingCliente.areaComercialId || ''}
                                                        onChange={e => setEditingCliente({ ...editingCliente, areaComercialId: e.target.value })}
                                                    >
                                                        <option value="">Selecione uma Área...</option>
                                                        {areas.map(area => (
                                                            <option key={area.id} value={area.id}>{area.nome}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Vendedor agora depende da Área selecionada, mas por simplificação mostramos input ou lógica futura */}
                                                <div>
                                                    <label className="text-xs text-slate-400 font-medium mb-1 block">Vendedor Principal</label>
                                                    <select
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                        disabled={!editingCliente.areaComercialId}
                                                    >
                                                        <option value="">Selecione a Área primeiro...</option>
                                                        {/* Lógica para filtrar vendedores da área selecionada seria adicionada aqui */}
                                                        {areas.find(a => a.id == editingCliente.areaComercialId)?.representantes?.map((rep: any) => (
                                                            <option key={rep.id} value={rep.vendedorId}>{rep.vendedorNome} ({rep.funcaoNome})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ModernInput label="Função" value="-" disabled onChange={() => { }} />
                                                <ModernInput label="Status" value="-" disabled onChange={() => { }} />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'INFO_COND_PAGTO' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-slate-400 font-medium mb-1 block">Condição de Pagamento Padrão</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                    value={editingCliente.condicaoPagamentoId || ''}
                                                    onChange={e => setEditingCliente({ ...editingCliente, condicaoPagamentoId: e.target.value })}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {condicoesPagamento.map(cp => (
                                                        <option key={cp.id} value={cp.id}>{cp.descricao}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-white">Limite de Crédito</span>
                                                    <span className="text-sm text-green-400 font-bold">R$ 5.000,00</span>
                                                </div>
                                                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-green-500 h-full w-[35%]"></div>
                                                </div>
                                                <div className="mt-2 text-xs text-slate-400">Utilizado: R$ 1.750,00 (35%)</div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'INFO_ROTEIRO' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-slate-400 font-medium mb-1 block">Roteiro de Atendimento</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                    value={editingCliente.areaComercialId || ''} // Reusing field for demo or add proper scheduleId
                                                    onChange={e => {
                                                        // logic to link schedule
                                                    }}
                                                >
                                                    <option value="">Selecione uma rota...</option>
                                                    {rotas.map(r => (
                                                        <option key={r.id} value={r.id}>{r.nome} - {r.descricao}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <ModernInput label="Ordem na Rota" type="number" placeholder="0" value="15" onChange={() => { }} />
                                        </div>
                                    )}

                                    {activeTab === 'INFO_COMISSAO' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-slate-400 font-medium mb-1 block">Perfil de Comissão</label>
                                                <select
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-indigo-500 outline-none"
                                                    onChange={e => {
                                                        // Update commission profile logic
                                                    }}
                                                >
                                                    <option value="">Perfil Padrão</option>
                                                    {perfisComissao.map(p => (
                                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-4 border border-white/10 rounded-lg overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-white/5 text-white/70">
                                                        <tr>
                                                            <th className="p-3">Função</th>
                                                            <th className="p-3 text-right">Perc. Comissão</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        <tr>
                                                            <td className="p-3 text-slate-300">VENDEDOR</td>
                                                            <td className="p-3 text-right text-white">1,50%</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="p-3 text-slate-300">SUPERVISOR</td>
                                                            <td className="p-3 text-right text-white">0,50%</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'INFO_COMPLEMENTO' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ModernInput label="Grupo de Cliente" placeholder="" />
                                            <ModernInput label="Tipo de Cliente" placeholder="Normal" />
                                            <ModernInput label="Consumidor Final" placeholder="" />
                                            <ModernInput label="Grupo de Tabelas" placeholder="GRUPO PADRAO" />
                                            <ModernInput label="Perfil de Produto" placeholder="" />
                                            <ModernInput label="Perfil Bonificação" placeholder="" />
                                        </div>
                                    )}

                                </GlassCard>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 animate-in fade-in duration-500">
                        <div className="w-full md:w-96">
                            <ModernInput
                                placeholder="Buscar por nome ou documento..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                icon={<Search size={18} className="text-blue-200/50" />}
                            />
                        </div>

                        <ModernButton
                            onClick={() => {
                                setEditingCliente({
                                    nomeFantasia: '',
                                    razaoSocial: '',
                                    documento: '',
                                    tipo: 'PF',
                                    status: 'ATIVO',
                                    papeis: ['CLIENTE'],
                                    endereco: {
                                        cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '', ibge: '',
                                        pais: 'Brasil', tipoEndereco: 'COMERCIAL'
                                    }
                                });
                                setActiveTab('GERAL');
                            }}
                            icon={Plus}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        >
                            Novo Cliente
                        </ModernButton>
                    </div>

                    {/* Tabela Glass */}
                    <GlassCard className="p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/10 text-blue-100/80 text-sm uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                                    <tr>
                                        <th className="p-4 font-semibold">Nome / Tipo</th>
                                        <th className="p-4 font-semibold">Documento</th>
                                        <th className="p-4 font-semibold">Contato</th>
                                        <th className="p-4 font-semibold">Localização</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 text-white/90">
                                    {loading ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-white/50">Carregando dados...</td></tr>
                                    ) : filteredClientes.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-white/50">Nenhum cliente encontrado.</td></tr>
                                    ) : (
                                        filteredClientes.map(cliente => (
                                            <tr key={cliente.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-white group-hover:text-indigo-200 transition-colors">{cliente.nomeFantasia || cliente.nome}</div>
                                                    <div className="text-xs text-blue-200/60 font-mono bg-white/5 inline-block px-1.5 py-0.5 rounded mt-1">{cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</div>
                                                    {cliente.razaoSocial && <div className="text-xs text-white/40 mt-1">{cliente.razaoSocial}</div>}
                                                </td>
                                                <td className="p-4 text-sm font-mono text-white/70">{cliente.documento}</td>
                                                <td className="p-4">
                                                    <div className="text-sm">{cliente.email}</div>
                                                    <div className="text-xs text-white/50">{cliente.telefone}</div>
                                                </td>
                                                <td className="p-4 text-sm text-white/70">
                                                    {cliente.endereco?.cidade ? (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-indigo-400" />
                                                            {cliente.endereco.cidade}/{cliente.endereco.uf}
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold border ${cliente.status === 'ATIVO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                                                        {cliente.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <ModernButton variant="ghost" className="p-2 h-auto hover:bg-white/10" onClick={() => { setEditingCliente(cliente); setActiveTab('GERAL'); }}>
                                                            <Pencil className="w-4 h-4 text-indigo-300" />
                                                        </ModernButton>
                                                        <ModernButton variant="ghost" className="p-2 h-auto hover:bg-white/10" onClick={() => handleDelete(cliente.id)}>
                                                            <Trash2 className="w-4 h-4 text-red-400" />
                                                        </ModernButton>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </>
            )}

        </LayoutWrapper>
    );
}
