/**
 * API SERVICE - Backend Simulado
 * Simula um servidor Node.js com banco de dados compartilhado
 * Todas as operações são sincronizadas entre módulos
 */

import {
  UUID, generateUUID,
  Empresa, Usuario, PerfilAcesso, LogSistema, ParametroSistema, ImpostoConfig, EstoqueMinimo,
  Colaborador, Cliente, AreaComercial, CondicaoPagamento, Turno, TarefaOperacional, OrdemServico,
  Fornecedor, SolicitacaoCompra, AprovacaoCompra, PedidoCompra, EntradaMercadoria,
  Insumo, ProdutoAcabado, LoteEstoque, MovimentacaoEstoque, AlertaEstoque,
  Receita, IngredienteReceita, OrdemProducao, PerdaProducao,
  TabelaPreco, ItemTabelaPreco, PedidoVenda, DescontoPromocional, PerfilComissao,
  Fatura, Cobranca,
  NFe, ItemNFe,
  CalculoImposto, RelatorioFiscal,
  PlanoContas, OperacaoContabil, LancamentoContabil,
  ContaPagar, ContaReceber, Boleto, RemessaBanco, FluxoCaixa,
  DRE, MargemProduto, ProjecaoFinanceira,
  Rota, Veiculo, Entrega, Entregador,
  Maquina, Manutencao, Depreciacao,
  Chamado, HistoricoChamado,
  Modulo, Permissao,
  MODULOS
} from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:3000';
export const api = axios.create({ baseURL: API_URL });

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Adicionando interface localmente para garantir
export interface Transportadora {
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
  createdAt: Date;
  updatedAt: Date;
}


export interface Estado {
  id: string;
  sigla: string;
  nome: string;
  icmsInterno: number;
  icmsInterestadual: number;
}

// ==================== BANCO DE DADOS EM MEMÓRIA ====================

class Database {
  // MÓDULO ADMINISTRATIVO
  empresas: Empresa[] = [];
  usuarios: Usuario[] = [];
  perfisAcesso: PerfilAcesso[] = [];
  logs: LogSistema[] = [];
  parametrosSistema: ParametroSistema[] = [];
  impostosConfig: ImpostoConfig[] = [];
  estoqueMinimo: EstoqueMinimo[] = [];

  estados: Estado[] = [
    { id: 'AC', sigla: 'AC', nome: 'Acre', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'AL', sigla: 'AL', nome: 'Alagoas', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'AP', sigla: 'AP', nome: 'Amapá', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'AM', sigla: 'AM', nome: 'Amazonas', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'BA', sigla: 'BA', nome: 'Bahia', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'CE', sigla: 'CE', nome: 'Ceará', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'DF', sigla: 'DF', nome: 'Distrito Federal', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'ES', sigla: 'ES', nome: 'Espírito Santo', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'GO', sigla: 'GO', nome: 'Goiás', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'MA', sigla: 'MA', nome: 'Maranhão', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'MT', sigla: 'MT', nome: 'Mato Grosso', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'MS', sigla: 'MS', nome: 'Mato Grosso do Sul', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'MG', sigla: 'MG', nome: 'Minas Gerais', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'PA', sigla: 'PA', nome: 'Pará', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'PB', sigla: 'PB', nome: 'Paraíba', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'PR', sigla: 'PR', nome: 'Paraná', icmsInterno: 19, icmsInterestadual: 12 },
    { id: 'PE', sigla: 'PE', nome: 'Pernambuco', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'PI', sigla: 'PI', nome: 'Piauí', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'RJ', sigla: 'RJ', nome: 'Rio de Janeiro', icmsInterno: 20, icmsInterestadual: 12 },
    { id: 'RN', sigla: 'RN', nome: 'Rio Grande do Norte', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'RS', sigla: 'RS', nome: 'Rio Grande do Sul', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'RO', sigla: 'RO', nome: 'Rondônia', icmsInterno: 17.5, icmsInterestadual: 12 },
    { id: 'RR', sigla: 'RR', nome: 'Roraima', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'SC', sigla: 'SC', nome: 'Santa Catarina', icmsInterno: 17, icmsInterestadual: 12 },
    { id: 'SP', sigla: 'SP', nome: 'São Paulo', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'SE', sigla: 'SE', nome: 'Sergipe', icmsInterno: 18, icmsInterestadual: 12 },
    { id: 'TO', sigla: 'TO', nome: 'Tocantins', icmsInterno: 18, icmsInterestadual: 12 }
  ];

  // MÓDULO OPERACIONAL
  colaboradores: Colaborador[] = [];
  transportadoras: Transportadora[] = [];
  clientes: Cliente[] = [
    {
      id: 'cli-001',
      empresaId: 'emp-001',
      nomeFantasia: 'Sorvetes & Cia Ltda',
      razaoSocial: 'Sorvetes & Cia Ltda',
      documento: '12.345.678/0001-90',
      tipo: 'PJ',
      status: 'ATIVO',
      email: 'contato@sorvetescia.com.br',
      telefone: '(11) 98765-4321',
      endereco: {
        cep: '01001-000', logradouro: 'Praça da Sé', numero: '100', bairro: 'Sé', cidade: 'São Paulo', uf: 'SP', pais: 'Brasil', tipoEndereco: 'COMERCIAL', ibge: '3550308'
      },
      papeis: ['CLIENTE'],
      createdAt: new Date(), updatedAt: new Date()
    },
    {
      id: 'cli-002',
      empresaId: 'emp-001',
      nomeFantasia: 'Padaria do João',
      razaoSocial: 'João Silva ME',
      documento: '98.765.432/0001-10',
      tipo: 'PJ',
      status: 'ATIVO',
      email: 'joao@padaria.com',
      telefone: '(11) 91234-5678',
      endereco: {
        cep: '01310-100', logradouro: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP', pais: 'Brasil', tipoEndereco: 'COMERCIAL', ibge: '3550308'
      },
      papeis: ['CLIENTE'],
      createdAt: new Date(), updatedAt: new Date()
    }
  ];
  areasComerciais: AreaComercial[] = [
    { id: 'area-001', empresaId: 'emp-001', nome: 'Zona Sul - SP', descricao: 'Região Santo Amaro/Interlagos', status: 'ATIVA', representantes: [], createdAt: new Date(), updatedAt: new Date() },
    { id: 'area-002', empresaId: 'emp-001', nome: 'Centro - SP', descricao: 'Região Central', status: 'ATIVA', representantes: [], createdAt: new Date(), updatedAt: new Date() }
  ];
  condicoesPagamento: CondicaoPagamento[] = [
    { id: 'cp-001', empresaId: 'emp-001', descricao: 'À Vista', ativo: true, status: 'ATIVO', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cp-002', empresaId: 'emp-001', descricao: 'Boleto 14 Dias', ativo: true, status: 'ATIVO', createdAt: new Date(), updatedAt: new Date() },
    { id: 'cp-003', empresaId: 'emp-001', descricao: 'Boleto 28 Dias', ativo: true, status: 'ATIVO', createdAt: new Date(), updatedAt: new Date() }
  ];
  turnos: Turno[] = [];
  tarefasOperacionais: TarefaOperacional[] = [];
  ordensServico: OrdemServico[] = [];

  // MÓDULO COMERCIAL
  // tabelasPreco: TabelaPreco[] = [];
  // itensTabelaPreco: ItemTabelaPreco[] = [];
  // pedidosVenda: PedidoVenda[] = [];
  // descontosPromocionais: DescontoPromocional[] = [];
  perfisComissao: PerfilComissao[] = [
    { id: 'pc-001', empresaId: 'emp-001', nome: 'Perfil Padrão', descricao: 'Comissão Padrão de Mercado', status: 'ATIVO', regras: [], createdAt: new Date(), updatedAt: new Date() }
  ];

  // MÓDULO COMPRAS
  fornecedores: Fornecedor[] = [];
  solicitacoesCompra: SolicitacaoCompra[] = [];
  aprovacoesCompra: AprovacaoCompra[] = [];
  pedidosCompra: PedidoCompra[] = [];
  entradasMercadoria: EntradaMercadoria[] = [];

  // MÓDULO ESTOQUE
  insumos: Insumo[] = [];
  produtosAcabados: ProdutoAcabado[] = [];
  lotesEstoque: LoteEstoque[] = [];
  movimentacoesEstoque: MovimentacaoEstoque[] = [];
  alertasEstoque: AlertaEstoque[] = [];

  // MÓDULO MANUFATURA
  receitas: Receita[] = [];
  ingredientesReceita: IngredienteReceita[] = [];
  ordensProducao: OrdemProducao[] = [];
  perdasProducao: PerdaProducao[] = [];

  // MÓDULO COMERCIAL
  tabelasPreco: TabelaPreco[] = [];
  itensTabelaPreco: ItemTabelaPreco[] = [];
  pedidosVenda: PedidoVenda[] = [];
  descontosPromocionais: DescontoPromocional[] = [];

  // MÓDULO FATURAMENTO
  faturas: Fatura[] = [];
  cobrancas: Cobranca[] = [];

  // MÓDULO DOCUMENTOS FISCAIS
  nfe: NFe[] = [];
  itensNFe: ItemNFe[] = [];

  // MÓDULO FISCAL
  calculosImposto: CalculoImposto[] = [];
  relatoriosFiscal: RelatorioFiscal[] = [];

  // MÓDULO CONTABILIDADE
  planoContas: PlanoContas[] = [];
  operacoesContabil: OperacaoContabil[] = [];
  lancamentosContabil: LancamentoContabil[] = [];

  // MÓDULO FINANCEIRO
  contasPagar: ContaPagar[] = [];
  contasReceber: ContaReceber[] = [];
  boletos: Boleto[] = [];
  remessasBanco: RemessaBanco[] = [];
  fluxoCaixa: FluxoCaixa[] = [];

  // MÓDULO FINANCEIRO PRO
  dres: DRE[] = [];
  margensProduto: MargemProduto[] = [];
  projecoesFinanceiras: ProjecaoFinanceira[] = [];

  // MÓDULO LOGÍSTICA
  rotas: Rota[] = [];
  veiculos: Veiculo[] = [];
  entregas: Entrega[] = [];
  entregadores: Entregador[] = [];

  // MÓDULO PATRIMÔNIO
  maquinas: Maquina[] = [];
  manutencoes: Manutencao[] = [];
  depreciacoes: Depreciacao[] = [];

  // MÓDULO SUPORTE
  chamados: Chamado[] = [];
  historicosChamado: HistoricoChamado[] = [];

  // CONTEXTO DA SESSÃO
  usuarioLogado?: Usuario;
  empresaAtual?: Empresa;
  permissoes: string[] = [];
}

export const db = new Database();

// ==================== SERVIÇO DE LOGS CENTRALIZADO ====================

class LogService {
  async registrar(
    modulo: Modulo,
    acao: string,
    descricao: string,
    dadosAnteriores?: any,
    dadosNovos?: any
  ): Promise<void> {
    const log: LogSistema = {
      id: generateUUID(),
      usuarioId: db.usuarioLogado?.id || undefined,
      modulo,
      acao,
      descricao,
      ip: '127.0.0.1', // Simulado
      userAgent: navigator.userAgent,
      dadosAnteriores,
      dadosNovos,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.logs.push(log);
    console.log(`[LOG] ${modulo} - ${acao}: ${descricao}`);
  }

  async listar(modulo?: Modulo): Promise<LogSistema[]> {
    if (modulo) {
      return db.logs.filter(l => l.modulo === modulo);
    }
    return [...db.logs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const logService = new LogService();

// ==================== SERVIÇO DE PERMISSÕES ====================

class PermissionService {
  async verificar(modulo: Modulo, acao: Permissao): Promise<boolean> {
    if (!db.usuarioLogado) return false;

    // Usuário admin tem acesso total
    if (db.usuarioLogado.perfilId === 'admin') return true;

    const perfil = db.perfisAcesso.find(p => p.id === db.usuarioLogado?.perfilId);
    if (!perfil) return false;

    const permissao = perfil.permissoes.find(p => p.modulo === modulo);
    if (!permissao) return false;

    const acaoMap: Record<Permissao, boolean> = {
      CRIAR: permissao.criar,
      LER: permissao.ler,
      ATUALIZAR: permissao.atualizar,
      DELETAR: permissao.deletar,
      APROVAR: permissao.aprovar,
    };

    return acaoMap[acao] || false;
  }

  async listarPermissoesUsuario(): Promise<string[]> {
    if (!db.usuarioLogado) return [];

    const perfil = db.perfisAcesso.find(p => p.id === db.usuarioLogado.perfilId);
    if (!perfil) return [];

    return perfil.permissoes.map(p => `${p.modulo}:${p.criar ? 'C' : ''}${p.ler ? 'R' : ''}${p.atualizar ? 'U' : ''}${p.deletar ? 'D' : ''}${p.aprovar ? 'A' : ''}`);
  }
}

export const permissionService = new PermissionService();

// ==================== MÓDULO ADMINISTRATIVO ====================

class AdminService {
  // Empresas
  async criarEmpresa(empresa: Omit<Empresa, 'id' | 'createdAt' | 'updatedAt'>): Promise<Empresa> {
    const novaEmpresa: Empresa = {
      ...empresa,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.empresas.push(novaEmpresa);
    await logService.registrar('ADMINISTRATIVO', 'CRIAR_EMPRESA', `Empresa ${novaEmpresa.nomeFantasia} criada`);
    return novaEmpresa;
  }

  async listarEmpresas(): Promise<Empresa[]> {
    return db.empresas.filter(e => e.status === 'ATIVA');
  }

  // Usuários
  async criarUsuario(usuario: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Usuario> {
    try {
      const res = await api.post('/users', usuario);
      const novoUsuario = res.data;
      // Update local cache if needed, but for now we rely on re-fetch or invalidation
      db.usuarios.push(novoUsuario);
      return novoUsuario;
    } catch (e) {
      console.error('Error creating user:', e);
      throw e;
    }
  }

  async listarUsuarios(): Promise<Usuario[]> {
    try {
      const res = await api.get('/users');
      db.usuarios = res.data; // Sync local
      return res.data;
    } catch (e) {
      console.error('Error listing users:', e);
      return db.usuarios; // Fallback
    }
  }

  // Perfis de Acesso
  async criarPerfil(perfil: Omit<PerfilAcesso, 'id' | 'createdAt' | 'updatedAt'>): Promise<PerfilAcesso> {
    try {
      // Backend expects 'permissoes' as stringified JSON for now based on schema
      const payload = {
        ...perfil,
        permissoes: JSON.stringify(perfil.permissoes)
      };
      const res = await api.post('/perfis', payload);

      // Transform back to frontend model
      const novoPerfil = {
        ...res.data,
        permissoes: typeof res.data.permissoes === 'string' ? JSON.parse(res.data.permissoes) : res.data.permissoes
      };

      db.perfisAcesso.push(novoPerfil);
      return novoPerfil;
    } catch (e) {
      console.error('Error creating profile:', e);
      throw e;
    }
  }

  async listarPerfis(): Promise<PerfilAcesso[]> {
    try {
      const res = await api.get('/perfis');
      const perfis = res.data.map((p: any) => ({
        ...p,
        permissoes: typeof p.permissoes === 'string' ? JSON.parse(p.permissoes) : p.permissoes
      }));
      db.perfisAcesso = perfis;
      return perfis;
    } catch (e) {
      console.error('Error listing profiles:', e);
      return db.perfisAcesso;
    }
  }

  // Parâmetros do Sistema
  async salvarParametro(parametro: Omit<ParametroSistema, 'id' | 'createdAt' | 'updatedAt'>): Promise<ParametroSistema> {
    const existe = db.parametrosSistema.find(p => p.chave === parametro.chave && p.empresaId === parametro.empresaId);
    if (existe) {
      const antigo = { ...existe };
      Object.assign(existe, { ...parametro, updatedAt: new Date() });
      await logService.registrar('ADMINISTRATIVO', 'ATUALIZAR_PARAMETRO', `Parâmetro ${parametro.chave} atualizado`, antigo, existe);
      return existe;
    }

    const novo: ParametroSistema = {
      ...parametro,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.parametrosSistema.push(novo);
    await logService.registrar('ADMINISTRATIVO', 'CRIAR_PARAMETRO', `Parâmetro ${novo.chave} criado`);
    return novo;
  }

  async listarParametros(empresaId: UUID, tipo?: string): Promise<ParametroSistema[]> {
    let params = db.parametrosSistema.filter(p => p.empresaId === empresaId);
    if (tipo) params = params.filter(p => p.tipo === tipo);
    return params;
  }

  // Impostos
  async salvarImposto(imposto: Omit<ImpostoConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ImpostoConfig> {
    const existe = db.impostosConfig.find(i => i.tipoImposto === imposto.tipoImposto && i.empresaId === imposto.empresaId);
    if (existe) {
      Object.assign(existe, { ...imposto, updatedAt: new Date() });
      await logService.registrar('ADMINISTRATIVO', 'ATUALIZAR_IMPOSTO', `Imposto ${imposto.tipoImposto} atualizado`);
      return existe;
    }

    const novo: ImpostoConfig = {
      ...imposto,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.impostosConfig.push(novo);
    await logService.registrar('ADMINISTRATIVO', 'CRIAR_IMPOSTO', `Imposto ${novo.tipoImposto} criado`);
    return novo;
  }

  // Estoque Mínimo
  async salvarEstoqueMinimo(item: Omit<EstoqueMinimo, 'id' | 'createdAt' | 'updatedAt'>): Promise<EstoqueMinimo> {
    const existe = db.estoqueMinimo.find(e => e.produtoId === item.produtoId && e.empresaId === item.empresaId);
    if (existe) {
      Object.assign(existe, { ...item, updatedAt: new Date() });
      return existe;
    }

    const novo: EstoqueMinimo = {
      ...item,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.estoqueMinimo.push(novo);
    await logService.registrar('ADMINISTRATIVO', 'CRIAR_ESTOQUE_MINIMO', `Estoque mínimo configurado para produto ${item.produtoId}`);
    return novo;
  }
}

export const adminService = new AdminService();

// ==================== MÓDULO OPERACIONAL ====================

class OperationalService {
  // Colaboradores
  async criarColaborador(colaborador: Omit<Colaborador, 'id' | 'createdAt' | 'updatedAt'>): Promise<Colaborador> {
    try {
      const response = await api.post('/colaboradores', colaborador);
      return response.data;
    } catch (e) {
      console.warn("Backend offline/error, saving to local memory DB", e);
      const novo: Colaborador = {
        ...colaborador,
        id: generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: colaborador.status || 'ATIVO',
      };
      db.colaboradores.push(novo);
      return novo;
    }
  }

  async listarColaboradores(): Promise<Colaborador[]> {
    try {
      const response = await api.get('/colaboradores');
      return response.data;
    } catch (e) {
      console.warn("Backend offline, returning local DB", e);
      return db.colaboradores;
    }
  }

  async atualizarColaborador(id: string, colaborador: Partial<Colaborador>): Promise<Colaborador> {
    try {
      const response = await api.patch(`/colaboradores/${id}`, colaborador);
      return response.data;
    } catch (e) {
      console.warn("Backend offline/error, updating local memory DB", e);
      const index = db.colaboradores.findIndex(c => c.id === id);
      if (index >= 0) {
        db.colaboradores[index] = { ...db.colaboradores[index], ...colaborador, updatedAt: new Date() };
        return db.colaboradores[index];
      }
      throw new Error('Colaborador não encontrado localmente');
    }
  }

  async removerColaborador(id: string): Promise<void> {
    try {
      await api.delete(`/colaboradores/${id}`);
    } catch (e) {
      console.warn("Backend offline/error, removing from local memory DB", e);
      // eslint-disable-next-line
      db.colaboradores = db.colaboradores.filter(c => c.id !== id);
    }
  }

  // Transportadoras
  async criarTransportadora(transportadora: Omit<Transportadora, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transportadora> {
    try {
      const response = await api.post('/transportadoras', transportadora);
      return response.data;
    } catch (e) {
      console.warn("Backend offline/error, saving to local memory DB", e);
      const novo: Transportadora = {
        ...transportadora,
        id: generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: transportadora.status || 'ATIVO',
      };
      db.transportadoras.push(novo);
      return novo;
    }
  }

  async listarTransportadoras(): Promise<Transportadora[]> {
    try {
      const response = await api.get('/transportadoras');
      return response.data;
    } catch (e) {
      console.warn("Backend offline, returning local DB", e);
      return db.transportadoras;
    }
  }

  async atualizarTransportadora(id: string, transportadora: Partial<Transportadora>): Promise<Transportadora> {
    try {
      const response = await api.patch(`/transportadoras/${id}`, transportadora);
      return response.data;
    } catch (e) {
      console.warn("Backend offline/error, updating local memory DB", e);
      const index = db.transportadoras.findIndex(c => c.id === id);
      if (index >= 0) {
        db.transportadoras[index] = { ...db.transportadoras[index], ...transportadora, updatedAt: new Date() };
        return db.transportadoras[index];
      }
      throw new Error('Transportadora não encontrada localmente');
    }
  }

  async removerTransportadora(id: string): Promise<void> {
    try {
      await api.delete(`/transportadoras/${id}`);
    } catch (e) {
      console.warn("Backend offline/error, removing from local memory DB", e);
      // eslint-disable-next-line
      db.transportadoras = db.transportadoras.filter(c => c.id !== id);
    }
  }

  // ESTADOS E CEP
  async listarEstados(): Promise<Estado[]> {
    // Simulating backend delay if needed
    return db.estados;
  }

  async atualizarEstado(id: string, estado: Partial<Estado>): Promise<Estado> {
    try {
      // Simulating an API Patch for States
      // const response = await api.patch(/estados/${id}, estado);
      // return response.data;
      throw new Error('API não implementada para estados ainda, usando local');
    } catch (e) {
      const index = db.estados.findIndex(s => s.id === id);
      if (index >= 0) {
        db.estados[index] = { ...db.estados[index], ...estado };
        return db.estados[index];
      }
      throw new Error('Estado não encontrado');
    }
  }

  async buscarCep(cep: string): Promise<{ logradouro: string, bairro: string, cidade: string, uf: string } | null> {
    // Mock de busca de CEP - idealmente conectaria com ViaCEP no frontend ou backend
    // Aqui vamos simular alguns ou retornar apenas dados vazios mas com validação simples
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    // Mock simples para teste
    if (cleanCep === '01001000') return { logradouro: 'Praça da Sé', bairro: 'Sé', cidade: 'São Paulo', uf: 'SP' };

    try {
      // Tentar buscar do ViaCEP direto aqui (frontend service simulation)
      const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
      if (response.data && !response.data.erro) {
        return {
          logradouro: response.data.logradouro,
          bairro: response.data.bairro,
          cidade: response.data.localidade,
          uf: response.data.uf
        };
      }
    } catch (e) {
      console.warn('Erro ao buscar CEP no ViaCEP', e);
    }

    return null;
  }

  // Clientes
  async criarCliente(cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    try {
      const response = await api.post('/clientes', cliente);
      return response.data;
    } catch (e) {
      console.warn("Backend offline/error, saving to local memory DB", e);
      const novo: Cliente = {
        ...cliente,
        id: generateUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: cliente.status || 'ATIVO',
        papeis: cliente.papeis || ['CLIENTE'],
        endereco: cliente.endereco || {
          cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '', ibge: '',
          pais: 'Brasil', tipoEndereco: 'COMERCIAL'
        }
      };
      db.clientes.push(novo);
      return novo;
    }
  }

  async listarClientes(): Promise<Cliente[]> {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (e) {
      console.warn("Backend offline, returning local DB", e);
      return db.clientes;
    }
  }

  async atualizarCliente(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    try {
      const response = await api.patch(`/clientes/${id}`, cliente);
      return response.data;
    } catch (e) {
      console.warn("Backend offline/error, updating local memory DB", e);
      const index = db.clientes.findIndex(c => c.id === id);
      if (index >= 0) {
        db.clientes[index] = { ...db.clientes[index], ...cliente, updatedAt: new Date() };
        return db.clientes[index];
      }
      throw new Error('Cliente não encontrado localmente');
    }
  }

  async removerCliente(id: string): Promise<void> {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (e) {
      console.warn("Backend offline/error, removing from local memory DB", e);
      // eslint-disable-next-line
      db.clientes = db.clientes.filter(c => c.id !== id);
    }
  }

  // Tarefas Operacionais
  async criarTarefa(tarefa: Omit<TarefaOperacional, 'id' | 'createdAt' | 'updatedAt'>): Promise<TarefaOperacional> {
    const response = await api.post('/tarefas', tarefa);
    return response.data;
  }

  async listarTarefasAutorizadas(): Promise<TarefaOperacional[]> {
    const response = await api.get('/tarefas');
    return response.data;
  }

  async atualizarTarefa(id: string, tarefa: Partial<TarefaOperacional>): Promise<TarefaOperacional> {
    const response = await api.patch(`/tarefas/${id}`, tarefa);
    return response.data;
  }

  async removerTarefa(id: string): Promise<void> {
    await api.delete(`/tarefas/${id}`);
  }

  // Areas Comerciais
  async listarAreas(): Promise<AreaComercial[]> {
    const response = await api.get('/areas-comerciais');
    return response.data;
  }

  async criarArea(area: Omit<AreaComercial, 'id' | 'createdAt' | 'updatedAt'>): Promise<AreaComercial> {
    const response = await api.post('/areas-comerciais', area);
    return response.data;
  }

  // Turnos
  async listarTurnos(): Promise<Turno[]> {
    const response = await api.get('/turnos');
    return response.data;
  }
}

class CondicoesPagamentoService {
  async listar(empresaId: string): Promise<CondicaoPagamento[]> {
    return db.condicoesPagamento; // Mock return for now
  }
}

class ComissoesService {
  async listarPerfis(empresaId: string): Promise<PerfilComissao[]> {
    return db.perfisComissao; // Mock return for now
  }
}

export const operationalService = new OperationalService();
export const condicoesPagamentoService = new CondicoesPagamentoService();
export const comissoesService = new ComissoesService();

// ==================== MÓDULO COMPRAS ====================

class PurchasingService {
  // Solicitação de Compra
  async criarSolicitacao(solicitacao: Omit<SolicitacaoCompra, 'id' | 'createdAt' | 'updatedAt'>): Promise<SolicitacaoCompra> {
    const numero = `SC-${Date.now()}`;
    const nova: SolicitacaoCompra = {
      ...solicitacao,
      numero,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.solicitacoesCompra.push(nova);
    await logService.registrar('COMPRAS', 'CRIAR_SOLICITACAO', `Solicitação ${numero} criada`);
    return nova;
  }

  // Aprovação de Compra
  async aprovarSolicitacao(aprovacao: Omit<AprovacaoCompra, 'id' | 'createdAt' | 'updatedAt'>): Promise<AprovacaoCompra> {
    const nova: AprovacaoCompra = {
      ...aprovacao,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.aprovacoesCompra.push(nova);

    // Atualiza status da solicitação
    const solicitacao = db.solicitacoesCompra.find(s => s.id === aprovacao.solicitacaoId);
    if (solicitacao) {
      solicitacao.status = aprovacao.status === 'APROVADA' ? 'APROVADA' : 'REJEITADA';
      solicitacao.updatedAt = new Date();
    }

    await logService.registrar('COMPRAS', 'APROVAR_COMPRA', `Solicitação ${aprovacao.solicitacaoId} ${aprovacao.status}`);
    return nova;
  }

  // Pedido de Compra
  async criarPedido(pedido: Omit<PedidoCompra, 'id' | 'numero' | 'createdAt' | 'updatedAt'>): Promise<PedidoCompra> {
    const numero = `PC-${Date.now()}`;
    const novo: PedidoCompra = {
      ...pedido,
      numero,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.pedidosCompra.push(novo);
    await logService.registrar('COMPRAS', 'CRIAR_PEDIDO', `Pedido ${numero} criado`);
    return novo;
  }

  // Entrada de Mercadoria (Integração com Estoque)
  async criarEntrada(entrada: Omit<EntradaMercadoria, 'id' | 'createdAt' | 'updatedAt'>): Promise<EntradaMercadoria> {
    const nova: EntradaMercadoria = {
      ...entrada,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.entradasMercadoria.push(nova);

    // INTEGRAÇÃO: Atualiza estoque automaticamente
    for (const item of entrada.itens) {
      await estoqueService.registrarEntrada({
        empresaId: entrada.empresaId,
        tipo: 'ENTRADA',
        origem: 'COMPRA',
        origemId: nova.id,
        produtoId: item.insumoId,
        loteId: await estoqueService.criarLote({
          empresaId: entrada.empresaId,
          produtoId: item.insumoId,
          tipo: 'INSUMO',
          lote: item.lote,
          validade: item.validade,
          quantidade: item.quantidade,
          localizacao: item.localizacao,
          custoUnitario: 0, // Será calculado
          status: 'ATIVO',
        }),
        quantidade: item.quantidade,
        localizacaoDestino: item.localizacao,
      });
    }

    // INTEGRAÇÃO: Gera contas a pagar
    const pedido = db.pedidosCompra.find(p => p.id === entrada.pedidoId);
    if (pedido) {
      await financeiroService.criarContaPagar({
        empresaId: entrada.empresaId,
        fornecedorId: pedido.fornecedorId,
        documento: `PC-${pedido.numero}`,
        dataEmissao: new Date(),
        dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        valorOriginal: pedido.valorTotal,
        valorJuros: 0,
        valorMulta: 0,
        valorDesconto: 0,
        valorTotal: pedido.valorTotal,
        status: 'ABERTA',
      });
    }

    await logService.registrar('COMPRAS', 'ENTRADA_MERCADORIA', `Entrada registrada para pedido ${entrada.pedidoId}`);
    return nova;
  }
}

export const purchasingService = new PurchasingService();

// ==================== MÓDULO ESTOQUE ====================

class EstoqueService {
  // Criar Lote
  async criarLote(lote: Omit<LoteEstoque, 'id' | 'createdAt' | 'updatedAt'>): Promise<UUID> {
    const novo: LoteEstoque = {
      ...lote,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.lotesEstoque.push(novo);
    return novo.id;
  }

  // Registrar Entrada
  async registrarEntrada(movimentacao: Omit<MovimentacaoEstoque, 'id' | 'createdAt' | 'updatedAt'>): Promise<MovimentacaoEstoque> {
    const nova: MovimentacaoEstoque = {
      ...movimentacao,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.movimentacoesEstoque.push(nova);

    // Atualiza quantidade no lote
    const lote = db.lotesEstoque.find(l => l.id === movimentacao.loteId);
    if (lote) {
      lote.quantidade += movimentacao.quantidade;
      lote.updatedAt = new Date();
    }

    await logService.registrar('ESTOQUE', 'ENTRADA', `Entrada de ${movimentacao.quantidade} unidades`);
    return nova;
  }

  // Registrar Saída (Com validação)
  async registrarSaida(movimentacao: Omit<MovimentacaoEstoque, 'id' | 'createdAt' | 'updatedAt'>): Promise<MovimentacaoEstoque> {
    // Validação: Nenhuma saída sem origem
    if (!movimentacao.origem) {
      throw new Error('Saída deve ter origem definida');
    }

    // Validação: Verifica se lote tem quantidade suficiente
    const lote = db.lotesEstoque.find(l => l.id === movimentacao.loteId);
    if (!lote || lote.quantidade < movimentacao.quantidade) {
      throw new Error('Quantidade insuficiente no lote');
    }

    // Validação: Verifica validade
    if (lote.validade < new Date()) {
      throw new Error('Lote vencido - não pode ser vendido');
    }

    const nova: MovimentacaoEstoque = {
      ...movimentacao,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.movimentacoesEstoque.push(nova);

    // Atualiza quantidade no lote
    lote.quantidade -= movimentacao.quantidade;
    lote.updatedAt = new Date();

    // Verifica estoque mínimo
    await this.verificarEstoqueMinimo(lote.produtoId);

    await logService.registrar('ESTOQUE', 'SAIDA', `Saída de ${movimentacao.quantidade} unidades`);
    return nova;
  }

  // Verificar Estoque Mínimo
  private async verificarEstoqueMinimo(produtoId: UUID): Promise<void> {
    const loteTotal = db.lotesEstoque
      .filter(l => l.produtoId === produtoId && l.status === 'ATIVO')
      .reduce((sum, l) => sum + l.quantidade, 0);

    const config = db.estoqueMinimo.find(e => e.produtoId === produtoId);
    if (config) {
      if (loteTotal <= config.alertaCritico) {
        const alerta: AlertaEstoque = {
          id: generateUUID(),
          empresaId: db.empresaAtual?.id || '',
          produtoId,
          tipo: 'CRITICO',
          mensagem: `Estoque crítico: ${loteTotal} unidades`,
          status: 'PENDENTE',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.alertasEstoque.push(alerta);
        await logService.registrar('ESTOQUE', 'ALERTA_CRITICO', `Estoque crítico para produto ${produtoId}`);
      } else if (loteTotal <= config.quantidadeMinima) {
        const alerta: AlertaEstoque = {
          id: generateUUID(),
          empresaId: db.empresaAtual?.id || '',
          produtoId,
          tipo: 'MINIMO',
          mensagem: `Estoque mínimo: ${loteTotal} unidades`,
          status: 'PENDENTE',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.alertasEstoque.push(alerta);
      }
    }
  }
}

export const estoqueService = new EstoqueService();

// ==================== MÓDULO MANUFATURA ====================

class ManufaturaService {
  // Criar Ordem de Produção
  async criarOrdemProducao(ordem: Omit<OrdemProducao, 'id' | 'numero' | 'custoTotal' | 'custoUnitario' | 'createdAt' | 'updatedAt'>): Promise<OrdemProducao> {
    // Validação: Verifica estoque suficiente para produção
    const receita = db.receitas.find(r => r.id === ordem.receitaId);
    if (!receita) throw new Error('Receita não encontrada');

    const ingredientes = db.ingredientesReceita.filter(i => i.receitaId === ordem.receitaId);

    for (const ingrediente of ingredientes) {
      const loteTotal = db.lotesEstoque
        .filter(l => l.produtoId === ingrediente.insumoId && l.status === 'ATIVO')
        .reduce((sum, l) => sum + l.quantidade, 0);

      const necessario = ingrediente.quantidade * (ordem.quantidade / receita.rendimento);

      if (loteTotal < necessario) {
        throw new Error(`Estoque insuficiente para ${ingrediente.insumoId}`);
      }
    }

    // Calcula custo de produção
    let custoTotal = 0;
    for (const ingrediente of ingredientes) {
      const custoInsumo = db.insumos.find(i => i.id === ingrediente.insumoId)?.custoAtual || 0;
      custoTotal += custoInsumo * ingrediente.quantidade * (ordem.quantidade / receita.rendimento);
    }

    const numero = `OP-${Date.now()}`;
    const nova: OrdemProducao = {
      ...ordem,
      numero,
      custoTotal,
      custoUnitario: custoTotal / ordem.quantidade,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.ordensProducao.push(nova);

    // INTEGRAÇÃO: Baixa automática de insumos do estoque
    for (const ingrediente of ingredientes) {
      const lotes = db.lotesEstoque
        .filter(l => l.produtoId === ingrediente.insumoId && l.status === 'ATIVO')
        .sort((a, b) => a.validade.getTime() - b.validade.getTime());

      let quantidadeNecessaria = ingrediente.quantidade * (ordem.quantidade / receita.rendimento);

      for (const lote of lotes) {
        if (quantidadeNecessaria <= 0) break;

        const quantidadeBaixar = Math.min(lote.quantidade, quantidadeNecessaria);

        await estoqueService.registrarSaida({
          empresaId: ordem.empresaId,
          tipo: 'SAIDA',
          origem: 'PRODUCAO',
          origemId: nova.id,
          produtoId: ingrediente.insumoId,
          loteId: lote.id,
          quantidade: quantidadeBaixar,
          localizacaoOrigem: lote.localizacao,
        });

        quantidadeNecessaria -= quantidadeBaixar;
      }
    }

    // INTEGRAÇÃO: Atualiza disponibilidade no Comercial
    const produto = db.produtosAcabados.find(p => p.id === receita.produtoId);
    if (produto) {
      // Registra entrada no estoque de produtos acabados
      const loteId = await estoqueService.criarLote({
        empresaId: ordem.empresaId,
        produtoId: receita.produtoId,
        tipo: 'PRODUTO_ACABADO',
        lote: `PROD-${numero}`,
        validade: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
        quantidade: ordem.quantidade,
        localizacao: 'PRODUCAO',
        custoUnitario: nova.custoUnitario,
        status: 'ATIVO',
      });

      await estoqueService.registrarEntrada({
        empresaId: ordem.empresaId,
        tipo: 'ENTRADA',
        origem: 'PRODUCAO',
        origemId: nova.id,
        produtoId: receita.produtoId,
        loteId,
        quantidade: ordem.quantidade,
        localizacaoDestino: 'PRODUCAO',
      });
    }

    await logService.registrar('MANUFATURA', 'CRIAR_ORDEM_PRODUCAO', `Ordem ${numero} criada`);
    return nova;
  }
}

export const manufaturaService = new ManufaturaService();

// ==================== MÓDULO COMERCIAL ====================

class CommercialService {
  // Criar Pedido de Venda
  async criarPedidoVenda(pedido: Omit<PedidoVenda, 'id' | 'numero' | 'valorTotal' | 'createdAt' | 'updatedAt'>): Promise<PedidoVenda> {
    // Validação: Verifica estoque disponível
    for (const item of pedido.itens) {
      const loteTotal = db.lotesEstoque
        .filter(l => l.produtoId === item.produtoId && l.status === 'ATIVO' && l.validade > new Date())
        .reduce((sum, l) => sum + l.quantidade, 0);

      if (loteTotal < item.quantidade) {
        throw new Error(`Estoque insuficiente para produto ${item.produtoId}`);
      }
    }

    // Validação: Verifica desconto (exige permissão se > 5%)
    if (pedido.descontoPercentual > 5) {
      const permissoes = await permissionService.listarPermissoesUsuario();
      if (!permissoes.some(p => p.includes('COMERCIAL:A'))) {
        throw new Error('Desconto acima de 5% requer aprovação');
      }
    }

    // Calcula valores
    const valorTotal = pedido.itens.reduce((sum, item) => sum + item.valorTotal, 0) - pedido.descontoValor;

    const numero = `PV-${Date.now()}`;
    const novo: PedidoVenda = {
      ...pedido,
      numero,
      valorTotal,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.pedidosVenda.push(novo);

    // INTEGRAÇÃO: Reserva automática no estoque
    for (const item of pedido.itens) {
      const lotes = db.lotesEstoque
        .filter(l => l.produtoId === item.produtoId && l.status === 'ATIVO' && l.validade > new Date())
        .sort((a, b) => a.validade.getTime() - b.validade.getTime());

      let quantidadeReservar = item.quantidade;

      for (const lote of lotes) {
        if (quantidadeReservar <= 0) break;

        const quantidadeReserva = Math.min(lote.quantidade, quantidadeReservar);

        await estoqueService.registrarSaida({
          empresaId: pedido.empresaId,
          tipo: 'SAIDA',
          origem: 'VENDA',
          origemId: novo.id,
          produtoId: item.produtoId,
          loteId: lote.id,
          quantidade: quantidadeReserva,
          localizacaoOrigem: lote.localizacao,
        });

        quantidadeReservar -= quantidadeReserva;
      }
    }

    await logService.registrar('COMERCIAL', 'CRIAR_PEDIDO', `Pedido ${numero} criado`);
    return novo;
  }
}

export const commercialService = new CommercialService();

// ==================== MÓDULO FATURAMENTO ====================

class FaturamentoService {
  // Gerar Fatura
  async gerarFatura(fatura: Omit<Fatura, 'id' | 'numero' | 'valorTotal' | 'valorLiquido' | 'createdAt' | 'updatedAt'>): Promise<Fatura> {
    const pedido = db.pedidosVenda.find(p => p.id === fatura.pedidoId);
    if (!pedido) throw new Error('Pedido não encontrado');

    const numero = `FAT-${Date.now()}`;
    const nova: Fatura = {
      ...fatura,
      numero,
      valorTotal: pedido.valorTotal,
      valorLiquido: pedido.valorTotal,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.faturas.push(nova);

    // INTEGRAÇÃO: Gera contas a receber
    await financeiroService.criarContaReceber({
      empresaId: fatura.empresaId,
      clienteId: pedido.clienteId,
      documento: numero,
      dataEmissao: new Date(),
      dataVencimento: fatura.dataVencimento,
      valorOriginal: pedido.valorTotal,
      valorJuros: 0,
      valorMulta: 0,
      valorDesconto: 0,
      valorTotal: pedido.valorTotal,
      status: 'ABERTA',
    });

    // INTEGRAÇÃO: Atualiza status do pedido
    pedido.status = 'FATURADO';
    pedido.updatedAt = new Date();

    await logService.registrar('FATURAMENTO', 'GERAR_FATURA', `Fatura ${numero} gerada`);
    return nova;
  }
}

export const faturamentoService = new FaturamentoService();

// ==================== MÓDULO DOCUMENTOS FISCAIS ====================

class DocumentoFiscalService {
  // Emitir NF-e
  async emitirNFe(nfe: Omit<NFe, 'id' | 'numero' | 'chaveAcesso' | 'xml' | 'createdAt' | 'updatedAt'>): Promise<NFe> {
    const numero = `NF${nfe.serie}-${Date.now()}`;
    const chaveAcesso = `${nfe.empresaId}${numero}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

    // Gera XML simulado
    const xml = this.gerarXMLNFe(nfe, numero, chaveAcesso);

    const nova: NFe = {
      ...nfe,
      numero,
      chaveAcesso,
      xml,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.nfe.push(nova);

    // Validação: Nenhuma venda finalizada sem NF-e
    if (nfe.tipo === 'SAIDA') {
      const pedido = db.pedidosVenda.find(p => p.id === nfe.clienteId);
      if (pedido) {
        pedido.status = 'FATURADO';
        pedido.updatedAt = new Date();
      }
    }

    await logService.registrar('DOCUMENTOS_FISCAIS', 'EMITIR_NFE', `NF-e ${numero} emitida`);
    return nova;
  }

  private gerarXMLNFe(nfe: Omit<NFe, 'id' | 'numero' | 'chaveAcesso' | 'xml' | 'createdAt' | 'updatedAt'>, numero: string, chaveAcesso: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe${chaveAcesso}" versao="4.00">
      <ide>
        <cUF>${nfe.empresaId}</cUF>
        <nNF>${numero}</nNF>
        <dhEmi>${new Date().toISOString()}</dhEmi>
        <tpNF>${nfe.tipo === 'SAIDA' ? '1' : '0'}</tpNF>
      </ide>
      <total>
        <ICMSTot>
          <vBC>${nfe.baseICMS}</vBC>
          <vICMS>${nfe.valorICMS}</vICMS>
          <vNF>${nfe.valorTotal}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;
  }
}

export const documentoFiscalService = new DocumentoFiscalService();

// ==================== MÓDULO FISCAL ====================

class FiscalService {
  // Calcular Impostos
  async calcularImpostos(documentoId: UUID, tipo: 'NF-E' | 'NFS-E' | 'CTE'): Promise<CalculoImposto[]> {
    const nfe = db.nfe.find(n => n.id === documentoId);
    if (!nfe) return [];

    const calculos: CalculoImposto[] = [];

    // ICMS
    const icmsConfig = db.impostosConfig.find(i => i.tipoImposto === 'ICMS' && i.empresaId === nfe.empresaId);
    if (icmsConfig) {
      const valorICMS = nfe.baseICMS * (icmsConfig.aliquota / 100);
      const calculo: CalculoImposto = {
        id: generateUUID(),
        empresaId: nfe.empresaId,
        tipoDocumento: tipo,
        documentoId,
        tipoImposto: 'ICMS',
        baseCalculo: nfe.baseICMS,
        aliquota: icmsConfig.aliquota,
        valor: valorICMS,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      calculos.push(calculo);
      db.calculosImposto.push(calculo);
    }

    // PIS/COFINS (simulado)
    ['PIS', 'COFINS'].forEach(tipoImposto => {
      const config = db.impostosConfig.find(i => i.tipoImposto === tipoImposto && i.empresaId === nfe.empresaId);
      if (config) {
        const valor = nfe.valorTotal * (config.aliquota / 100);
        const calculo: CalculoImposto = {
          id: generateUUID(),
          empresaId: nfe.empresaId,
          tipoDocumento: tipo,
          documentoId,
          tipoImposto: tipoImposto as any,
          baseCalculo: nfe.valorTotal,
          aliquota: config.aliquota,
          valor,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        calculos.push(calculo);
        db.calculosImposto.push(calculo);
      }
    });

    await logService.registrar('FISCAL', 'CALCULAR_IMPOSTOS', `Impostos calculados para ${tipo} ${documentoId}`);
    return calculos;
  }
}

export const fiscalService = new FiscalService();

// ==================== MÓDULO CONTABILIDADE ====================

class ContabilidadeService {
  // Gerar Lancamento
  async gerarLancamento(lancamento: Omit<LancamentoContabil, 'id' | 'createdAt' | 'updatedAt'>): Promise<LancamentoContabil> {
    const novo: LancamentoContabil = {
      ...lancamento,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.lancamentosContabil.push(novo);
    await logService.registrar('CONTABILIDADE', 'LANCAR', `Lançamento ${lancamento.documento} registrado`);
    return novo;
  }
}

export const contabilidadeService = new ContabilidadeService();

// ==================== MÓDULO FINANCEIRO ====================

class FinanceiroService {
  // Contas a Pagar
  async criarContaPagar(conta: Omit<ContaPagar, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContaPagar> {
    const nova: ContaPagar = {
      ...conta,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.contasPagar.push(nova);

    // Atualiza fluxo de caixa
    await this.registrarFluxoCaixa({
      empresaId: conta.empresaId,
      data: new Date(),
      tipo: 'SAIDA',
      categoria: 'COMPRAS',
      descricao: `Pagamento ${conta.documento}`,
      valor: conta.valorTotal,
      saldo: this.calcularSaldo(),
    });

    await logService.registrar('FINANCEIRO', 'CRIAR_CONTA_PAGAR', `Conta a pagar ${conta.documento} criada`);
    return nova;
  }

  // Contas a Receber
  async criarContaReceber(conta: Omit<ContaReceber, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContaReceber> {
    const nova: ContaReceber = {
      ...conta,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.contasReceber.push(nova);

    await logService.registrar('FINANCEIRO', 'CRIAR_CONTA_RECEBER', `Conta a receber ${conta.documento} criada`);
    return nova;
  }

  // Gerar Boleto
  async gerarBoleto(boleto: Omit<Boleto, 'id' | 'codigoBarras' | 'linhaDigitavel' | 'createdAt' | 'updatedAt'>): Promise<Boleto> {
    const codigoBarras = `${boleto.banco}${Date.now()}${boleto.valor}`;
    const linhaDigitavel = `${boleto.banco}000000${boleto.valor}`;

    const novo: Boleto = {
      ...boleto,
      id: generateUUID(),
      codigoBarras,
      linhaDigitavel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.boletos.push(novo);

    await logService.registrar('FINANCEIRO', 'GERAR_BOLETO', `Boleto gerado para ${boleto.contaReceberId}`);
    return novo;
  }

  // Registrar Fluxo de Caixa
  async registrarFluxoCaixa(fluxo: Omit<FluxoCaixa, 'id' | 'saldo' | 'createdAt' | 'updatedAt'>): Promise<FluxoCaixa> {
    const saldo = this.calcularSaldo() + (fluxo.tipo === 'ENTRADA' ? fluxo.valor : -fluxo.valor);

    const novo: FluxoCaixa = {
      ...fluxo,
      id: generateUUID(),
      saldo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.fluxoCaixa.push(novo);

    return novo;
  }

  private calcularSaldo(): number {
    return db.fluxoCaixa.reduce((sum, f) => {
      return sum + (f.tipo === 'ENTRADA' ? f.valor : -f.valor);
    }, 0);
  }
}

export const financeiroService = new FinanceiroService();

// ==================== MÓDULO FINANCEIRO PRO ====================

class FinanceiroProService {
  // Gerar DRE
  async gerarDRE(empresaId: UUID, mes: string, ano: number): Promise<DRE> {
    // Calcula receitas
    const receitas = db.contasReceber
      .filter(c => c.empresaId === empresaId && c.status === 'PAGA')
      .reduce((sum, c) => sum + c.valorTotal, 0);

    // Calcula custos
    const custos = db.contasPagar
      .filter(c => c.empresaId === empresaId && c.status === 'PAGA')
      .reduce((sum, c) => sum + c.valorTotal, 0);

    const dre: DRE = {
      id: generateUUID(),
      empresaId,
      periodo: `${mes}/${ano}`,
      receitaBruta: receitas,
      deducoes: 0,
      receitaLiquida: receitas,
      custoVendas: custos,
      lucroBruto: receitas - custos,
      despesasOperacionais: 0,
      lucroOperacional: receitas - custos,
      despesasFinanceiras: 0,
      lucroLiquido: receitas - custos,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.dres.push(dre);

    await logService.registrar('FINANCEIRO_PRO', 'GERAR_DRE', `DRE gerado para ${mes}/${ano}`);
    return dre;
  }

  // Margem por Sabor
  async calcularMargemSabor(produtoId: UUID, mes: string, ano: number): Promise<MargemProduto> {
    const vendas = db.pedidosVenda
      .filter(p => {
        const data = new Date(p.createdAt);
        return data.getMonth() === new Date(mes).getMonth() &&
          data.getFullYear() === ano &&
          p.itens.some(i => i.produtoId === produtoId);
      })
      .reduce((sum, p) => {
        const item = p.itens.find(i => i.produtoId === produtoId);
        return sum + (item ? item.valorTotal : 0);
      }, 0);

    const producoes = db.ordensProducao
      .filter(o => {
        const receita = db.receitas.find(r => r.id === o.receitaId);
        return receita?.produtoId === produtoId &&
          new Date(o.createdAt).getMonth() === new Date(mes).getMonth() &&
          new Date(o.createdAt).getFullYear() === ano;
      })
      .reduce((sum, o) => sum + o.custoTotal, 0);

    const margem: MargemProduto = {
      id: generateUUID(),
      empresaId: db.empresaAtual?.id || '',
      produtoId,
      periodo: `${mes}/${ano}`,
      receita: vendas,
      custo: producoes,
      margemPercentual: vendas > 0 ? ((vendas - producoes) / vendas) * 100 : 0,
      margemValor: vendas - producoes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.margensProduto.push(margem);

    return margem;
  }
}

export const financeiroProService = new FinanceiroProService();

// ==================== MÓDULO LOGÍSTICA ====================

class LogisticaService {
  // Criar Rota
  async criarRota(rota: Omit<Rota, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rota> {
    const nova: Rota = {
      ...rota,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.rotas.push(nova);

    // INTEGRAÇÃO: Cria entregas para pedidos da rota
    const pedidos = db.pedidosVenda.filter(p => p.status === 'RESERVADO').slice(0, 5);
    for (const pedido of pedidos) {
      await this.criarEntrega({
        empresaId: rota.empresaId,
        rotaId: nova.id,
        pedidoId: pedido.id,
        clienteId: pedido.clienteId,
        ordem: db.entregas.filter(e => e.rotaId === nova.id).length + 1,
        endereco: 'Endereço do cliente', // Seria buscado do cadastro do cliente
        status: 'PENDENTE',
      });
    }

    await logService.registrar('LOGISTICA', 'CRIAR_ROTA', `Rota ${nova.nome} criada`);
    return nova;
  }

  // Criar Entrega
  async criarEntrega(entrega: Omit<Entrega, 'id' | 'createdAt' | 'updatedAt'>): Promise<Entrega> {
    const nova: Entrega = {
      ...entrega,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.entregas.push(nova);
    return nova;
  }

  // Atualizar Localização do Entregador (Tempo Real)
  async atualizarLocalizacaoEntregador(entregadorId: UUID, lat: number, lng: number): Promise<void> {
    const entregador = db.entregadores.find(e => e.id === entregadorId);
    if (entregador) {
      entregador.localizacaoAtual = {
        latitude: lat,
        longitude: lng,
        timestamp: new Date(),
      };
      entregador.updatedAt = new Date();

      // Broadcast para outros módulos (simulado)
      console.log(`[REALTIME] Entregador ${entregador.nome} em ${lat}, ${lng}`);
    }
  }

  // Confirmar Entrega
  async confirmarEntrega(entregaId: UUID, assinatura?: string, fotos?: string[]): Promise<Entrega> {
    const entrega = db.entregas.find(e => e.id === entregaId);
    if (!entrega) throw new Error('Entrega não encontrada');

    entrega.status = 'ENTREGUE';
    entrega.dataEntrega = new Date();
    entrega.assinatura = assinatura;
    entrega.fotos = fotos;
    entrega.updatedAt = new Date();

    // INTEGRAÇÃO: Atualiza status do pedido
    const pedido = db.pedidosVenda.find(p => p.id === entrega.pedidoId);
    if (pedido) {
      pedido.status = 'FATURADO';
      pedido.updatedAt = new Date();
    }

    await logService.registrar('LOGISTICA', 'CONFIRMAR_ENTREGA', `Entrega ${entregaId} confirmada`);
    return entrega;
  }

  async listarRotas(): Promise<Rota[]> {
    // Return mocked routes from DB or fetch from API
    return db.rotas;
  }
}

export const logisticaService = new LogisticaService();

// ==================== MÓDULO PATRIMÔNIO ====================

class PatrimonioService {
  // Registrar Manutenção
  async registrarManutencao(manutencao: Omit<Manutencao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Manutencao> {
    const nova: Manutencao = {
      ...manutencao,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.manutencoes.push(nova);

    // INTEGRAÇÃO: Gera despesa financeira
    await financeiroService.criarContaPagar({
      empresaId: manutencao.empresaId,
      documento: `MAN-${nova.id}`,
      dataEmissao: new Date(),
      dataVencimento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      valorOriginal: manutencao.custo,
      valorJuros: 0,
      valorMulta: 0,
      valorDesconto: 0,
      valorTotal: manutencao.custo,
      status: 'ABERTA',
    });

    await logService.registrar('PATRIMONIO', 'REGISTRAR_MANUTENCAO', `Manutenção registrada para máquina ${manutencao.maquinaId}`);
    return nova;
  }
}

export const patrimonioService = new PatrimonioService();

// ==================== MÓDULO SUPORTE ====================

class SuporteService {
  // Criar Chamado
  async criarChamado(chamado: Omit<Chamado, 'id' | 'numero' | 'dataPrevista' | 'createdAt' | 'updatedAt'>): Promise<Chamado> {
    const numero = `CHM-${Date.now()}`;
    const novo: Chamado = {
      ...chamado,
      numero,
      dataPrevista: new Date(Date.now() + chamado.slaHoras * 60 * 60 * 1000),
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.chamados.push(novo);

    await logService.registrar('SUPORTE', 'CRIAR_CHAMADO', `Chamado ${numero} criado`);
    return novo;
  }

  // Adicionar Histórico
  async adicionarHistorico(historico: Omit<HistoricoChamado, 'id' | 'createdAt' | 'updatedAt'>): Promise<HistoricoChamado> {
    const novo: HistoricoChamado = {
      ...historico,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    db.historicosChamado.push(novo);

    await logService.registrar('SUPORTE', 'ATUALIZAR_CHAMADO', `Histórico adicionado ao chamado ${historico.chamadoId}`);
    return novo;
  }
}

export const suporteService = new SuporteService();

// ==================== SERVIÇO DE AUTENTICAÇÃO ====================

class AuthService {
  async login(email: string, senha: string): Promise<Usuario> {
    try {
      // 1. Authenticate with Backend
      const response = await api.post('/auth/login', { email, password: senha });
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);

      // 2. Fetch User Profile
      const profileResponse = await api.get('/auth/profile');
      const backendUser = profileResponse.data;

      // 3. Map to Frontend User Model
      // Note: Backend might return slightly different structure, so we adapt it.
      // We also need to ensure the related objects (Empresa, Perfil) exist in the in-memory DB for compatibility.

      const usuario: Usuario = {
        id: backendUser.id,
        empresaId: backendUser.empresaId,
        perfilId: backendUser.perfilId, // 'admin' in backend seed vs 'admin-id' in frontend? Seed says 'admin'
        nome: backendUser.nome || 'Usuário Backend', // Backend might not have name in profile response yet if it's just from JWT payload
        email: backendUser.email,
        senha: '', // Don't keep password in memory
        cargo: backendUser.cargo || 'Funcionário',
        departamento: 'Geral',
        status: 'ATIVO',
        ultimoLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 4. Inject into in-memory DB for compatibility with legacy services
      // Check if user already exists in memory to preserve local specific data if needed? 
      // Or just overwrite. Overwriting is safer for "logging in".
      const existingUserIndex = db.usuarios.findIndex(u => u.id === usuario.id);
      if (existingUserIndex >= 0) {
        db.usuarios[existingUserIndex] = usuario;
      } else {
        db.usuarios.push(usuario);
      }

      // 5. Handle Company (Empresa)
      // Backend returns company ID. We need to fetch details or mock it if backend doesn't provide it yet.
      // For now, if enterprise doesn't exist locally, create a placeholder so the UI doesn't crash.
      let empresa = db.empresas.find(e => e.id === usuario.empresaId);
      if (!empresa) {
        // Create a temporary enterprise object based on ID
        empresa = {
          id: usuario.empresaId,
          cnpj: '00.000.000/0000-00', // Placeholder
          razaoSocial: 'Empresa Backend',
          nomeFantasia: 'Empresa Backend',
          tipo: 'MATRIZ',
          endereco: { logradouro: '', numero: '', bairro: '', cidade: '', uf: '', cep: '' },
          telefone: '',
          email: '',
          status: 'ATIVA',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        db.empresas.push(empresa);
      }

      // 6. Handle Profile (PerfilAcesso)
      // Check if profile exists locally
      let perfil = db.perfisAcesso.find(p => p.id === usuario.perfilId);
      if (!perfil && usuario.perfilId === '1') { // Assuming '1' is admin role from backend seed? No, backend seed uses auto-increment ID usually or UUID.
        // Let's assume if it is NOT found, we give full access for now if it looks like admin
        // Or purely fallback to existing admin profile
      }

      // Update Session
      db.usuarioLogado = usuario;
      db.empresaAtual = empresa;
      db.permissoes = await permissionService.listarPermissoesUsuario();

      await logService.registrar('ADMINISTRATIVO', 'LOGIN', `Usuário ${usuario.nome} logado via Backend`);
      return usuario;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Credenciais inválidas ou erro no servidor');
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    if (db.usuarioLogado) {
      await logService.registrar('ADMINISTRATIVO', 'LOGOUT', `Usuário ${db.usuarioLogado.nome} deslogado`);
    }
    db.usuarioLogado = undefined;
    db.empresaAtual = undefined;
    db.permissoes = [];
  }

  async getUsuarioLogado(): Promise<Usuario | undefined> {
    // Ideally we should validate token here if page reloads
    return db.usuarioLogado;
  }

  async getEmpresaAtual(): Promise<Empresa | undefined> {
    return db.empresaAtual;
  }
}

export const authService = new AuthService();

// ==================== SEED INICIAL (Dados de Demo) ====================

export async function seedInitialData(): Promise<void> {
  try {
    console.log('🌱 Iniciando seed de dados...');

    // Tenta listar empresas para ver se já existe algo
    try {
      const empresas = await adminService.listarEmpresas();
      if (empresas.length > 0) {
        console.log('✅ Dados já existem, pulando seed.');
        return;
      }
    } catch (e) {
      console.warn('⚠️ Erro ao verificar existência de dados, tentando prosseguir com seed...', e);
    }

    // Criar empresa demo
    const empresa = await adminService.criarEmpresa({
      cnpj: '12.345.678/0001-99',
      razaoSocial: 'Sorvetes Demo Ltda',
      nomeFantasia: 'Sorvetes Demo',
      tipo: 'MATRIZ',
      endereco: {
        logradouro: 'Rua dos Sorvetes',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01000-000',
      },
      telefone: '(11) 99999-9999',
      email: 'contato@sorvetesdemo.com.br',
      status: 'ATIVA',
    });

    // Criar perfil admin
    const perfilAdmin = await adminService.criarPerfil({
      nome: 'Administrador',
      descricao: 'Acesso total ao sistema',
      permissoes: MODULOS.map(modulo => ({
        modulo,
        criar: true,
        ler: true,
        atualizar: true,
        deletar: true,
        aprovar: true,
      })),
    });

    // Criar usuário admin
    await adminService.criarUsuario({
      empresaId: empresa.id,
      perfilId: perfilAdmin.id,
      nome: 'Administrador',
      email: 'admin@sorvetesdemo.com.br',
      senha: 'admin123',
      cargo: 'Gerente',
      departamento: 'TI',
      status: 'ATIVO',
    });

    // Criar alguns produtos
    await adminService.criarPerfil({
      nome: 'Operador',
      descricao: 'Acesso operacional',
      permissoes: [
        { modulo: 'OPERACIONAL', criar: true, ler: true, atualizar: true, deletar: false, aprovar: false },
        { modulo: 'COMERCIAL', criar: true, ler: true, atualizar: true, deletar: false, aprovar: false },
      ],
    });

    console.log('✅ Dados iniciais seedados com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed de dados (pode ser ignorado se for duplicidade):', error);
    console.error('❌ Erro no seed de dados (pode ser ignorado se for duplicidade):', error);
  }
}

// ==================== MÓDULO PRODUTOS ====================

class ProdutosService {
  async listar(empresaId: string): Promise<any[]> {
    const response = await api.get(`/produtos?empresaId=${empresaId}`);
    return response.data;
  }

  async criar(produto: any): Promise<any> {
    const response = await api.post('/produtos', produto);
    return response.data;
  }

  async atualizar(id: string, produto: any): Promise<any> {
    const response = await api.patch(`/produtos/${id}`, produto);
    return response.data;
  }

  async remover(id: string): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }
}

export const produtosService = new ProdutosService();

// ==================== EXPORTAÇÃO GLOBAL ====================

// CommercialService duplicado removido. PedidosService mantido se necessário ou movido se estiver duplicado também.
// Verificando se PedidosService também está duplicado. O lint não reclamou de PedidosService, só Commercial.

class PedidosService {
  async listarClientes(empresaId: string): Promise<any[]> {
    // Se tiver backend real for Clientes, usar:
    // const response = await api.get(`/clientes?empresaId=${empresaId}`);
    // return response.data;

    // Fallback para mock local se não tiver backend ainda
    return db.clientes.filter(c => c.empresaId === empresaId);
  }
  async listar(empresaId: string): Promise<any[]> {
    const response = await api.get(`/pedidos?empresaId=${empresaId}`);
    return response.data;
  }

  async criar(pedido: any): Promise<any> {
    const response = await api.post('/pedidos', pedido);
    return response.data;
  }

  async atualizar(id: string, pedido: any): Promise<any> {
    const response = await api.patch(`/pedidos/${id}`, pedido);
    return response.data;
  }

  async remover(id: string): Promise<void> {
    await api.delete(`/pedidos/${id}`);
  }
}

// ==================== MÓDULO COMERCIAL (Novos) ====================



class TabelasPrecoService {
  async listarGrupos(empresaId: string): Promise<any[]> {
    const response = await api.get(`/tabelas-preco/grupos?empresaId=${empresaId}`);
    return response.data;
  }
  async listarTabelas(grupoId: string): Promise<any[]> {
    try {
      // Mock ou Endpoint real se existir filtro por grupo
      // Por enquanto listamos todas e filtramos se der, ou endpoint especifico
      const response = await api.get(`/tabelas-preco?grupoId=${grupoId}`);
      return response.data;
    } catch (e) { return []; }
  }
  async listarItens(tabelaId: string): Promise<any[]> {
    const response = await api.get(`/tabelas-preco/${tabelaId}/itens`);
    return response.data;
  }

  async criarGrupo(data: any): Promise<any> {
    const response = await api.post('/tabelas-preco/grupos', data);
    return response.data;
  }

  async criarTabela(data: any): Promise<any> {
    const response = await api.post('/tabelas-preco', data);
    return response.data;
  }

  async atualizarTabela(id: string, data: any): Promise<any> {
    const response = await api.patch(`/tabelas-preco/${id}`, data);
    return response.data;
  }

  async sincronizarItens(tabelaId: string): Promise<any> {
    const response = await api.post(`/tabelas-preco/${tabelaId}/sincronizar`);
    return response.data;
  }
}

class AreasComerciaisServiceFrontend {
  async listar(empresaId: string): Promise<any[]> {
    const response = await api.get(`/areas-comerciais?empresaId=${empresaId}`);
    return response.data;
  }
}

export const tabelasPrecoService = new TabelasPrecoService();
export const areasComerciaisService = new AreasComerciaisServiceFrontend();

export const pedidosService = new PedidosService();

// Agregador Principal
export const dbService = {
  db,
  adminService,
  operationalService,
  purchasingService,
  estoqueService, // Serviço interno simulado (memory) - Ajustar se for migrar pra backend real
  manufaturaService,
  commercialService: new CommercialService(), // Mock antigo, manter se quiser ou substituir
  pedidosService, // Novo Backend Real
  produtosService,

  // Helper para dados da sessão
  getEmpresaData: () => db.empresaAtual || JSON.parse(localStorage.getItem('empresaData') || '{}'),
  getUsuarioData: () => db.usuarioLogado || JSON.parse(localStorage.getItem('usuarioData') || '{}'),

  faturamentoService,
  documentoFiscalService,
  fiscalService,
  contabilidadeService,
  financeiroService,
  financeiroProService,
  logisticaService,
  patrimonioService,
  suporteService,
  authService,
  logService,
  permissionService,
  seedInitialData,
};
