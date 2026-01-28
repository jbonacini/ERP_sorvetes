import { useState, useEffect } from 'react';
import { EstoqueScreen } from './components/EstoqueScreen';
import { VendasScreen } from './components/VendasScreen';
import {
  Shield,
  Users,
  Package,
  ShoppingCart,
  Factory,
  CreditCard,
  FileText,
  Truck,
  MapPin,
  Wrench,
  LifeBuoy,
  Database,
  BarChart3,
  Receipt,
  FileBarChart,
  Building2,
  AlertCircle,
  LogOut,
  User,
  Building,
  FolderOpen,
  BookOpen,
  Container,
  CircleDollarSign,
  Barcode,
  FileCheck,
  Smartphone,
  Calculator,
  CalendarRange,
  DollarSign,
  Coins,
  KeyRound,
  Info,
  Minimize2,
  Power
} from 'lucide-react';
import { dbService, seedInitialData } from '@/services/api';
import { LoginYeti } from '@/components/LoginYeti';
import { PerfisScreen } from '@/components/PerfisScreen';
import { UsuariosScreen } from '@/components/UsuariosScreen';
import { ClientesScreen } from '@/components/ClientesScreen';
import { ColaboradoresScreen } from '@/components/ColaboradoresScreen';
import { CondicoesPagamentoScreen } from '@/components/CondicoesPagamentoScreen';
import { AreasComerciaisScreen } from '@/components/AreasComerciaisScreen';
import { TabelasPrecoScreen } from '@/components/TabelasPrecoScreen';
import { GruposTabelaScreen } from '@/components/GruposTabelaScreen';
import { OperationalModule } from '@/components/OperationalModule';
import { EstadosScreen } from '@/components/EstadosScreen';
import { cn } from '@/utils/cn';

// Componente de Dashboard (Redesign Moderno)
function Dashboard({ usuario, empresa, onLogout }: { usuario: any; empresa: any; onLogout: () => void }) {
  const [moduloAtivo, setModuloAtivo] = useState('HOME');
  const [permissoes, setPermissoes] = useState<string[]>([]);

  useEffect(() => {
    loadPermissoes();
  }, []);

  const loadPermissoes = async () => {
    const perms = await dbService.permissionService.listarPermissoesUsuario();
    setPermissoes(perms);
  };

  const hasPermission = (modulo: string) => {
    // Se for admin hardcoded no frontend ou backend, libera tudo
    if (usuario?.email?.includes('admin') || usuario?.cargo?.toLowerCase() === 'gerente') return true;
    return permissoes.some(p => p.startsWith(modulo));
  };

  // Definição dos Módulos com Design Híbrido (Categorias + Ícones Limpos)
  const categorias = [
    {
      titulo: 'Operacional',
      // Título estilizado como "pill" semi-transparente
      headerStyle: 'bg-emerald-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'OPERACIONAL', nome: 'Operacional', icon: Users, cor: 'from-emerald-400 to-teal-500' },
        { id: 'ADMINISTRATIVO', nome: 'Administrativo', icon: BarChart3, cor: 'from-blue-500 to-indigo-600' },
        { id: 'PATRIMONIO', nome: 'Patrimônio', icon: FolderOpen, cor: 'from-amber-500 to-orange-600' },
      ]
    },
    {
      titulo: 'Produtos',
      headerStyle: 'bg-blue-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'COMPRAS', nome: 'Compras', icon: ShoppingCart, cor: 'from-cyan-400 to-blue-500' },
        { id: 'COMERCIAL', nome: 'Comercial (Pedidos)', icon: CircleDollarSign, cor: 'from-fuchsia-500 to-purple-600' },
        { id: 'FATURAMENTO', nome: 'Faturamento', icon: Receipt, cor: 'from-indigo-400 to-blue-500' },
      ]
    },
    {
      titulo: 'Estoque & Manufatura',
      headerStyle: 'bg-purple-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'ESTOQUE', nome: 'Estoque', icon: Container, cor: 'from-violet-500 to-purple-600' },
        { id: 'MANUFATURA', nome: 'Manufatura', icon: Factory, cor: 'from-pink-500 to-rose-500' },
      ]
    },
    {
      titulo: 'Doc. Eletrônicos',
      headerStyle: 'bg-orange-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'DOCUMENTOS_FISCAIS', nome: 'Nota Fiscal (NFe)', icon: FileText, cor: 'from-orange-400 to-red-500' },
        { id: 'DOCUMENTOS_FISCAIS_OUTROS', nome: 'Docs. Fiscais', icon: FileCheck, cor: 'from-yellow-400 to-orange-500' },
      ]
    },
    {
      titulo: 'Logística',
      headerStyle: 'bg-cyan-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'LOGISTICA', nome: 'Logística', icon: Truck, cor: 'from-cyan-500 to-teal-500' },
        { id: 'MOBILE_LOGISTICA', nome: 'App Entregadores', icon: Smartphone, cor: 'from-sky-400 to-blue-500' },
      ]
    },
    {
      titulo: 'Financeiro / Fiscal',
      headerStyle: 'bg-green-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'CONTABILIDADE', nome: 'Contabilidade', icon: Calculator, cor: 'from-gray-400 to-gray-600' },
        { id: 'FISCAL', nome: 'Fiscal', icon: BookOpen, cor: 'from-amber-400 to-yellow-500' },
        { id: 'FINANCEIRO', nome: 'Financeiro', icon: DollarSign, cor: 'from-emerald-500 to-green-600' },
        { id: 'FINANCEIRO_PRO', nome: 'Financeiro Pro', icon: Coins, cor: 'from-lime-500 to-green-500' },
      ]
    },
    {
      titulo: 'Sistema',
      headerStyle: 'bg-slate-600/80 text-white backdrop-blur-sm',
      modulos: [
        { id: 'TROCAR_USUARIO', nome: 'Trocar Usuário', icon: KeyRound, cor: 'from-slate-500 to-slate-600' },
        { id: 'SUPORTE', nome: 'Suporte', icon: Info, cor: 'from-blue-400 to-blue-500' },
        { id: 'MINIMIZAR', nome: 'Minimizar', icon: Minimize2, cor: 'from-blue-300 to-blue-400' },
        { id: 'SAIR', nome: 'Sair', icon: LogOut, cor: 'from-red-500 to-red-600' },
      ]
    }
  ];

  const handleModuleClick = (id: string) => {
    if (id === 'SAIR' || id === 'TROCAR_USUARIO') {
      if (id === 'SAIR') onLogout();
      else onLogout(); // Por enquanto volta pro login
    } else if (id === 'MINIMIZAR') {
      // Placeholder
    } else {
      if (hasPermission(id)) {
        setModuloAtivo(id);
      }
    }
  };

  if (moduloAtivo === 'HOME') {
    return (
      <div className="min-h-screen relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 flex items-center justify-center p-4">
        {/* Background Decorative Elements - Landing Page Style */}
        <div className="absolute inset-0 z-0">
          {/* Imagem de Fundo */}
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3270&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Overlay Gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-purple-900/40 mix-blend-multiply"></div>
        </div>

        {/* Floating Glass Container */}
        <div className="relative z-10 w-full max-w-[1400px] h-[90vh] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-2xl overflow-hidden flex flex-col">

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center p-8 pb-4 text-white gap-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner border border-white/20">
                <Factory size={32} className="text-white drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm font-display text-white">ERP Sorvetes</h1>
                <p className="text-blue-100 font-light opacity-80 text-sm tracking-wide">{empresa?.nomeFantasia || 'Empresa Modelo'} • {empresa?.cnpj}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-2 pl-6 rounded-full border border-white/10 shadow-lg">
              <div className="text-right">
                <p className="text-sm font-bold leading-tight text-white">{usuario?.nome}</p>
                <p className="text-xs text-blue-200 font-medium">{usuario?.cargo || 'Colaborador'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
                {usuario?.nome?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Scrollable Content Area - Horizontal Columns */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-8 custom-scrollbar">
            <div className="flex flex-row items-start justify-center gap-6 min-w-max mx-auto h-full pb-10">
              {categorias.map((categoria, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 w-[160px]">
                  {/* Category Header - Restored Glass Style but keeping the Bar Shape */}
                  <div className={`w-full py-2 px-2 text-center rounded-lg shadow-lg backdrop-blur-md border border-white/10 ${categoria.headerStyle}`}>
                    <span className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-md">
                      {categoria.titulo}
                    </span>
                  </div>

                  {/* Modules Vertical Stack */}
                  <div className="flex flex-col gap-4 w-full items-center">
                    {categoria.modulos.map((modulo) => {
                      // Verificar permissão
                      const isSystem = ['SAIR', 'TROCAR_USUARIO', 'MINIMIZAR', 'SUPORTE'].includes(modulo.id);
                      const enabled = isSystem || hasPermission(modulo.id);
                      const Icon = modulo.icon;

                      return (
                        <button
                          key={modulo.id}
                          onClick={() => {
                            if (enabled) {
                              handleModuleClick(modulo.id);
                            }
                          }}
                          disabled={!enabled}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 p-3 w-full rounded-xl transition-all duration-300",
                            "hover:bg-white/10 border border-transparent hover:border-white/10", // Subtle hover effect
                            "active:scale-95 group",
                            !enabled && "opacity-40 grayscale cursor-not-allowed"
                          )}
                        >
                          {/* Ícone Solto - Com Design Original (Gradiente) */}
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:-translate-y-1",
                            enabled ? `bg-gradient-to-br ${modulo.cor} text-white` : "bg-slate-700 text-slate-400"
                          )}>
                            <Icon size={28} strokeWidth={2} className="drop-shadow-sm" />
                          </div>

                          {/* Label Text - Restored White Text */}
                          <span className="text-xs sm:text-sm font-medium text-white/90 text-center leading-tight drop-shadow-md group-hover:text-white transition-colors">
                            {modulo.nome}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza o módulo selecionado
  if (moduloAtivo === 'COLABORADORES') return <ColaboradoresScreen onBack={() => setModuloAtivo('HOME')} />;
  if (moduloAtivo === 'CONDICOES_PAGAMENTO') return <CondicoesPagamentoScreen onBack={() => setModuloAtivo('HOME')} />;
  if (moduloAtivo === 'AREAS_COMERCIAIS') return <AreasComerciaisScreen onBack={() => setModuloAtivo('HOME')} />;
  if (moduloAtivo === 'TABELAS_PRECO') return <TabelasPrecoScreen onBack={() => setModuloAtivo('HOME')} />;
  if (moduloAtivo === 'GRUPOS_TABELA') return <GruposTabelaScreen onBack={() => setModuloAtivo('HOME')} />;
  return <ModuleRenderer modulo={moduloAtivo} onBack={() => setModuloAtivo('HOME')} usuario={usuario} empresa={empresa} />;
}

// Componente de Renderização de Módulos
function ModuleRenderer({ modulo, onBack, usuario, empresa }: { modulo: string; onBack: () => void; usuario: any; empresa: any }) {
  const [activeSubModule, setActiveSubModule] = useState<string>('DASHBOARD');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset submodule when main module changes
    setActiveSubModule('DASHBOARD');
  }, [modulo]);

  useEffect(() => {
    if (activeSubModule === 'EMPRESAS' && modulo === 'ADMINISTRATIVO') {
      loadEmpresas();
    }
  }, [activeSubModule, modulo]);

  const loadEmpresas = async () => {
    setLoading(true);
    try {
      const res = await dbService.adminService.listarEmpresas();
      setData(res);
    } catch (e) { console.error(e) }
    finally { setLoading(false); }
  }

  // Render Administrative Screens directly
  if (modulo === 'ADMINISTRATIVO') {
    if (activeSubModule === 'PERFIS') return <div className="h-full overflow-y-auto"><button onClick={() => setActiveSubModule('DASHBOARD')} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><PerfisScreen /></div>;
    if (activeSubModule === 'USUARIOS') return <div className="h-full overflow-y-auto"><button onClick={() => setActiveSubModule('DASHBOARD')} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><UsuariosScreen /></div>;
    if (activeSubModule === 'ESTADOS') return <div className="h-full overflow-y-auto"><button onClick={() => setActiveSubModule('DASHBOARD')} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><EstadosScreen /></div>;

    // Default Dashboard for Admin
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-colors"><Shield className="text-blue-600" /></button>
          <h1 className="text-2xl font-bold text-slate-800">Administrativo</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={() => setActiveSubModule('EMPRESAS')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100">
            <Building2 className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Empresas</h3>
            <p className="text-sm text-slate-500 mt-1">Gerencie filiais e dados cadastrais</p>
          </button>
          <button onClick={() => setActiveSubModule('USUARIOS')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100">
            <Users className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Usuários</h3>
            <p className="text-sm text-slate-500 mt-1">Controle de acesso e colaboradores</p>
          </button>
          <button onClick={() => setActiveSubModule('PERFIS')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100">
            <Shield className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Perfis de Acesso</h3>
            <p className="text-sm text-slate-500 mt-1">Defina permissões por módulo</p>
          </button>
          <button onClick={() => setActiveSubModule('ESTADOS')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100">
            <MapPin className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Estados & ICMS</h3>
            <p className="text-sm text-slate-500 mt-1">Configurar alíquotas por UF</p>
          </button>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100 opacity-60 cursor-not-allowed">
            <Database className="w-10 h-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Logs do Sistema</h3>
            <p className="text-sm text-slate-500 mt-1">Auditoria de ações (Em breve)</p>
          </div>
        </div>

        {activeSubModule === 'EMPRESAS' && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Lista de Empresas</h3>
            {loading ? <p>Carregando...</p> : (
              <ul>
                {data.map(d => <li key={d.id} className="py-2 border-b">{d.nomeFantasia} ({d.cnpj})</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }




  // Render Products & Manufacturing Screens
  if (modulo === 'ESTOQUE') {
    return <div className="h-full overflow-y-auto"><button onClick={onBack} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><EstoqueScreen /></div>;
  }

  // Módulo COMERCIAL
  if (modulo === 'COMERCIAL') {
    if (activeSubModule === 'VENDAS') return <div className="h-full overflow-y-auto"><button onClick={() => setActiveSubModule('DASHBOARD')} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><VendasScreen /></div>;
    // Cadastros
    if (activeSubModule === 'GRUPOS_TABELA') return <div className="h-full overflow-y-auto"><button onClick={() => setActiveSubModule('DASHBOARD')} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><GruposTabelaScreen onBack={() => setActiveSubModule('DASHBOARD')} /></div>;
    if (activeSubModule === 'TABELAS_PRECO') return <div className="h-full overflow-y-auto"><button onClick={() => setActiveSubModule('DASHBOARD')} className="m-4 text-sm text-indigo-600 hover:underline">{'< Voltar'}</button><TabelasPrecoScreen onBack={() => setActiveSubModule('DASHBOARD')} /></div>;

    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-colors"><CircleDollarSign className="text-purple-600" /></button>
          <h1 className="text-2xl font-bold text-slate-800">Comercial</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Action */}
          <button onClick={() => setActiveSubModule('VENDAS')} className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left">
            <ShoppingCart className="w-10 h-10 mb-4 opacity-90" />
            <h3 className="text-lg font-bold">Pedidos de Venda</h3>
            <p className="text-sm opacity-80 mt-1">Gerenciar pedidos e orçamentos</p>
          </button>

          {/* Submenu Cadastros */}
          <div className="md:col-span-3 mt-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Cadastros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setActiveSubModule('GRUPOS_TABELA')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100">
                <Package className="w-8 h-8 text-indigo-500 mb-3" />
                <h3 className="font-semibold text-slate-800">Grupos de Tabelas</h3>
              </button>
              <button onClick={() => setActiveSubModule('TABELAS_PRECO')} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-slate-100">
                <DollarSign className="w-8 h-8 text-indigo-500 mb-3" />
                <h3 className="font-semibold text-slate-800">Tabelas de Preço</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Operational Module (New Implementation)
  if (modulo === 'OPERACIONAL') {
    return <OperationalModule onBack={onBack} />;
  }

  // Default Generic Renderer for other modules (Placeholder)
  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><LogOut className="w-5 h-5" /></button>
        <h1 className="text-xl font-bold">{modulo}</h1>
      </div>
      <div className="p-12 text-center text-gray-500">
        <div className="text-4xl mb-4">🚧</div>
        <p>Módulo em desenvolvimento</p>
      </div>
    </div>
  );
}

function getModuleFeatures(modulo: string): string[] {
  const features: Record<string, string[]> = {
    ADMINISTRATIVO: [
      'Cadastro de empresas (matriz e filiais)',
      'Cadastro de usuários',
      'Perfis de acesso com permissões',
      'Parâmetros fiscais, financeiros e operacionais',
      'Controle de logs',
      'Configuração de impostos padrão',
      'Configuração de estoque mínimo',
    ],
    OPERACIONAL: [
      'Cadastro de colaboradores',
      'Cadastro de clientes com API Correios',
      'Cadastro de áreas comerciais',
      'Condições de pagamento',
      'Controle de turnos',
      'Registro de tarefas operacionais',
      'Ordens internas de serviço',
    ],
    COMPRAS: [
      'Cadastro de fornecedores',
      'Solicitação de compra',
      'Aprovação de compra',
      'Pedido de compra',
      'Entrada de mercadoria',
      'Integração automática com estoque',
    ],
    ESTOQUE: [
      'Controle de insumos e produtos acabados',
      'Controle por lote, validade e localização',
      'Alertas de estoque mínimo',
      'Controle de perdas',
      'Validade bloqueia vendas vencidas',
    ],
    MANUFATURA: [
      'Cadastro de receitas (sabores)',
      'Lista de ingredientes por receita',
      'Ordem de produção',
      'Registro de perdas',
      'Controle de produção diária',
      'Cálculo automático de custo unitário',
    ],
    COMERCIAL: [
      'Cadastro de clientes PF e PJ',
      'Pedidos de venda',
      'Tabela de preços',
      'Descontos promocionais',
      'Reserva automática no estoque',
    ],
    FATURAMENTO: [
      'Geração de faturas',
      'Emissão de cobranças',
      'Impressão e download',
      'Geração automática de contas a receber',
    ],
    DOCUMENTOS_FISCAIS: [
      'Emissão de NF-e',
      'Armazenamento de XML',
      'Cancelamento',
      'Consulta',
      'Integração com faturamento',
    ],
    FISCAL: [
      'Cálculo automático de impostos',
      'Relatórios fiscais',
      'Integração com NF-e',
      'Contabilidade e financeiro',
    ],
    CONTABILIDADE: [
      'Plano de contas',
      'Cadastro de operações',
      'Exportações contábeis',
      'Relatórios',
      'Integração com fiscal',
    ],
    FINANCEIRO: [
      'Contas a pagar',
      'Contas a receber',
      'Geração de boletos',
      'Registro de remessa ao banco',
      'Fluxo de caixa',
    ],
    FINANCEIRO_PRO: [
      'DRE (Demonstrativo de Resultados)',
      'Margem por sabor',
      'Custos de produção',
      'Projeções financeiras',
    ],
    LOGISTICA: [
      'Rotas de entrega',
      'Veículos refrigerados',
      'Controle de entregas',
      'Visualização em tempo real no mapa',
      'Integração com mobile',
    ],
    MOBILE_LOGISTICA: [
      'Lista de entregas',
      'Confirmação de entrega',
      'Assinatura digital',
      'Fotos da entrega',
      'Localização em tempo real',
    ],
    PATRIMONIO: [
      'Cadastro de máquinas',
      'Depreciação automática',
      'Controle de manutenções',
      'Integração com financeiro',
    ],
    SUPORTE: [
      'Cadastro de chamados',
      'Controle de SLA',
      'Histórico de atendimento',
      'Integração com administração',
    ],
  };
  return features[modulo] || [];
}

function getIntegrations(modulo: string): string[] {
  const integrations: Record<string, string[]> = {
    ADMINISTRATIVO: ['Todos os módulos (permissões)', 'Logs centralizados'],
    OPERACIONAL: ['Estoque', 'Comercial', 'Logística', 'Manufatura'],
    COMPRAS: ['Estoque', 'Financeiro', 'Fiscal'],
    ESTOQUE: ['Compras', 'Manufatura', 'Comercial', 'Logística'],
    MANUFATURA: ['Estoque', 'Financeiro', 'Comercial'],
    COMERCIAL: ['Estoque', 'Faturamento', 'Logística', 'Financeiro'],
    FATURAMENTO: ['Comercial', 'NF-e', 'Financeiro'],
    DOCUMENTOS_FISCAIS: ['Compras', 'Faturamento', 'Fiscal'],
    FISCAL: ['NF-e', 'Contabilidade', 'Financeiro'],
    CONTABILIDADE: ['Fiscal', 'Financeiro'],
    FINANCEIRO: ['Compras', 'Vendas', 'Fiscal'],
    FINANCEIRO_PRO: ['Manufatura', 'Financeiro'],
    LOGISTICA: ['Comercial', 'Estoque', 'Mobile Logística'],
    MOBILE_LOGISTICA: ['Logística (tempo real)'],
    PATRIMONIO: ['Financeiro'],
    SUPORTE: ['Administração'],
  };
  return integrations[modulo] || [];
}

// Componente Principal
export function App() {

  const [usuario, setUsuario] = useState<any>(null);
  const [empresa, setEmpresa] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Timeout de segurança para não travar na tela de loading
    const timeout = setTimeout(() => {
      console.warn('⚠️ Timeout na inicialização, forçando entrada.');
      setInitialized(true);
    }, 3000);

    // Seed dados iniciais
    seedInitialData()
      .catch(err => console.error('Erro no seed:', err))
      .finally(() => {
        clearTimeout(timeout);
        setInitialized(true);
      });
  }, []);

  const handleLogin = async (usuario: any) => {
    setUsuario(usuario);
    const emp = await dbService.authService.getEmpresaAtual();
    setEmpresa(emp);
  };

  const handleLogout = () => {
    setUsuario(null);
    setEmpresa(null);
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-500 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">CARREGANDO SISTEMA...</h1>
          <p className="text-xl">Se você vê isso, o React está funcionando.</p>
          <p className="text-sm mt-2">Aguardando backend em localhost:3000...</p>
          <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <LoginYeti onLogin={setUsuario} />;
  }

  return (
    <Dashboard
      usuario={usuario}
      empresa={empresa}
      onLogout={() => setUsuario(null)}
    />
  );
}
