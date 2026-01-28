/**
 * ERP SISTEMA DE GESTÃO INTEGRADO PARA EMPRESA DE SORVETES
 * Sistema completo com 16 módulos integrados
 */

// ==================== TIPOS BASE ====================
export type UUID = string;

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// ==================== MÓDULO ADMINISTRATIVO ====================

export interface Empresa extends Timestamps {
  id: UUID;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipo: 'MATRIZ' | 'FILIAL';
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    latitude?: number;
    longitude?: number;
  };
  telefone: string;
  email: string;
  inscricaoEstadual?: string;
  status: 'ATIVA' | 'INATIVA' | 'BLOQUEADA';
}

export interface Usuario extends Timestamps {
  id: UUID;
  empresaId: UUID;
  perfilId: UUID;
  nome: string;
  email: string;
  senha: string;
  cargo: string;
  departamento: string;
  telefone?: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  ultimoLogin?: Date;
  permissoes?: string[];
}

export interface PerfilAcesso extends Timestamps {
  id: UUID;
  nome: string;
  descricao: string;
  permissoes: {
    modulo: string;
    criar: boolean;
    ler: boolean;
    atualizar: boolean;
    deletar: boolean;
    aprovar: boolean;
  }[];
}

export interface LogSistema extends Timestamps {
  id: UUID;
  usuarioId?: UUID;
  modulo: string;
  acao: string;
  descricao: string;
  ip?: string;
  userAgent?: string;
  dadosAnteriores?: any;
  dadosNovos?: any;
}

export interface ParametroSistema extends Timestamps {
  id: UUID;
  empresaId: UUID;
  tipo: 'FISCAL' | 'FINANCEIRO' | 'OPERACIONAL' | 'ESTOQUE';
  chave: string;
  valor: any;
  descricao: string;
}

export interface ImpostoConfig extends Timestamps {
  id: UUID;
  empresaId: UUID;
  tipoImposto: 'ICMS' | 'IPI' | 'PIS' | 'COFINS' | 'ISS';
  aliquota: number;
  baseCalculo: string;
  descricao: string;
}

export interface EstoqueMinimo extends Timestamps {
  id: UUID;
  empresaId: UUID;
  produtoId: UUID;
  tipo: 'INSUMO' | 'PRODUTO_ACABADO';
  quantidadeMinima: number;
  alertaCritico: number;
}

// ==================== MÓDULO OPERACIONAL ====================

export interface Colaborador extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  dataAdmissao: Date;
  dataDemissao?: Date;
  status: 'ATIVO' | 'INATIVO' | 'AFASTADO';
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL';
}

export interface Cliente extends Timestamps {
  id: UUID;
  empresaId: UUID;
  tipo: 'PF' | 'PJ';
  nome?: string; // @deprecated Use nomeFantasia
  nomeFantasia: string;
  razaoSocial?: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string;
  dataNascimento?: Date;
  inscricaoEstadual?: string;
  endereco: {
    tipoEndereco: 'COMERCIAL' | 'RESIDENCIAL' | 'COBRANCA' | 'ENTREGA';
    descricao?: string; // ex: Matriz, Filial Norte
    pais: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    ibge: string;
    latitude?: number;
    longitude?: number;
    caixaPostal?: string;
    municipioId?: string; // Para integração fiscal futura
  };
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  rg?: string;
  contribuinte?: boolean;
  regimeTributario?: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  papeis?: ('CLIENTE' | 'FORNECEDOR' | 'FUNCIONARIO' | 'VENDEDOR' | 'MOTORISTA' | 'TRANSPORTADORA')[];

  // Commercial Fields
  areaComercialId?: UUID;
  grupoTabelaPrecoId?: UUID;
  condicaoPagamentoId?: UUID;
}

export interface AreaComercial extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  descricao: string;
  gerenteId?: UUID;
  // regiao removido
  status: 'ATIVA' | 'INATIVA';
  representantes?: {
    vendedorId: UUID;
    vendedorNome: string;
    funcaoNome: string;
  }[];
}

export interface CondicaoPagamento extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome?: string; // Schema usa nome
  descricao: string;
  // parcelas, diasParcelas removidos por incompatibilidade momentanea
  ativo: boolean; // Schema usa ativo boolean
  status: 'ATIVO' | 'INATIVO'; // Mantendo p compatibilidade visual
}

export interface Turno extends Timestamps {
  id: UUID;
  empresaId: UUID;
  descricao: string;
  horaInicio: string;
  horaFim: string;
  dias: string[];
}

export interface TarefaOperacional extends Timestamps {
  id: UUID;
  empresaId: UUID;
  colaboradorId?: UUID;
  tipo: 'LIMPEZA' | 'MANUTENCAO' | 'ABASTECIMENTO' | 'VISITA' | 'OUTROS';
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  dataAgendada: Date;
  dataExecucao?: Date;
  observacoes?: string;
}

export interface OrdemServico extends Timestamps {
  id: UUID;
  empresaId: UUID;
  numero: string;
  clienteId?: UUID;
  tipo: 'INTERNA' | 'EXTERNA';
  descricao: string;
  prioridade: string;
  status: 'ABERTA' | 'EXECUCAO' | 'AGUARDANDO' | 'CONCLUIDA' | 'FECHADA';
  tecnicoId?: UUID;
  dataPrevisao: Date;
  dataFinalizacao?: Date;
}

// ==================== MÓDULO COMPRAS ====================

export interface Fornecedor extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  cnpj: string;
  ie?: string;
  email: string;
  telefone: string;
  contato: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  status: 'ATIVO' | 'INATIVO';
  categoria: string;
}

export interface SolicitacaoCompra extends Timestamps {
  id: UUID;
  empresaId: UUID;
  solicitanteId: UUID;
  numero: string;
  dataSolicitacao: Date;
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'COMPRADA';
  observacoes?: string;
  itens: {
    insumoId: UUID;
    quantidade: number;
    unidade: string;
    justificativa: string;
  }[];
}

export interface AprovacaoCompra extends Timestamps {
  id: UUID;
  solicitacaoId: UUID;
  aprovadorId: UUID;
  status: 'APROVADA' | 'REJEITADA';
  motivo?: string;
}

export interface PedidoCompra extends Timestamps {
  id: UUID;
  empresaId: UUID;
  numero: string;
  fornecedorId: UUID;
  dataEmissao: Date;
  dataEntrega: Date;
  status: 'ABERTO' | 'EM_TRANSITO' | 'ENTREGUE' | 'CANCELADO';
  valorTotal: number;
  observacoes?: string;
  itens: {
    insumoId: UUID;
    quantidade: number;
    unidade: string;
    valorUnitario: number;
    valorTotal: number;
  }[];
}

export interface EntradaMercadoria extends Timestamps {
  id: UUID;
  empresaId: UUID;
  pedidoId: UUID;
  numeroNota: string;
  dataEntrada: Date;
  status: 'RECEBIDO' | 'INSPECAO' | 'ESTOQUE';
  itens: {
    insumoId: UUID;
    lote: string;
    validade: Date;
    quantidade: number;
    localizacao: string;
  }[];
}

// ==================== MÓDULO ESTOQUE ====================

export interface Insumo extends Timestamps {
  id: UUID;
  empresaId: UUID;
  codigo: string;
  nome: string;
  descricao: string;
  unidade: string;
  tipo: 'SECO' | 'CONGELADO' | 'REFRIGERADO' | 'PERECIVEL';
  custoAtual: number;
  status: 'ATIVO' | 'INATIVO';
}

export interface ProdutoAcabado extends Timestamps {
  id: UUID;
  empresaId: UUID;
  codigo: string;
  nome: string;
  sabor: string;
  descricao: string;
  unidade: string;
  peso: number;
  precoVenda: number;
  custoProducao: number;
  margem: number;
  status: 'ATIVO' | 'INATIVO';
}

export interface LoteEstoque extends Timestamps {
  id: UUID;
  empresaId: UUID;
  produtoId: UUID;
  tipo: 'INSUMO' | 'PRODUTO_ACABADO';
  lote: string;
  validade: Date;
  quantidade: number;
  localizacao: string;
  custoUnitario: number;
  status: 'ATIVO' | 'VENCIDO' | 'BAIXADO';
}

export interface MovimentacaoEstoque extends Timestamps {
  id: UUID;
  empresaId: UUID;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'PERDA';
  origem: string; // COMPRA, PRODUCAO, VENDA, PERDA, AJUSTE
  origemId: UUID;
  produtoId: UUID;
  loteId: UUID;
  quantidade: number;
  localizacaoOrigem?: string;
  localizacaoDestino?: string;
  motivo?: string;
}

export interface AlertaEstoque extends Timestamps {
  id: UUID;
  empresaId: UUID;
  produtoId: UUID;
  tipo: 'MINIMO' | 'CRITICO' | 'VENCIDO';
  mensagem: string;
  status: 'PENDENTE' | 'RESOLVIDO';
}

// ==================== MÓDULO MANUFATURA ====================

export interface Receita extends Timestamps {
  id: UUID;
  empresaId: UUID;
  produtoId: UUID;
  nome: string;
  descricao: string;
  rendimento: number; // em kg ou litros
  tempoProducao: number; // em minutos
  instrucoes: string;
  status: 'ATIVA' | 'INATIVA';
}

export interface IngredienteReceita {
  id: UUID;
  receitaId: UUID;
  insumoId: UUID;
  quantidade: number;
  unidade: string;
  ordem: number;
}

export interface OrdemProducao extends Timestamps {
  id: UUID;
  empresaId: UUID;
  numero: string;
  receitaId: UUID;
  dataProducao: Date;
  turnoId?: UUID;
  quantidade: number;
  custoTotal: number;
  custoUnitario: number;
  status: 'ABERTA' | 'EM_PRODUCAO' | 'CONCLUIDA' | 'CANCELADA';
  observacoes?: string;
}

export interface PerdaProducao extends Timestamps {
  id: UUID;
  empresaId: UUID;
  ordemProducaoId: UUID;
  motivo: string;
  quantidade: number;
  custo: number;
  responsavelId?: UUID;
  observacoes?: string;
}

// ==================== MÓDULO COMERCIAL ====================

export interface TabelaPreco extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  descricao: string;
  tipo: 'FIXA' | 'PROMOCIONAL' | 'CLIENTE_ESPECIFICO';
  status: 'ATIVA' | 'INATIVA';
}

export interface ItemTabelaPreco {
  id: UUID;
  tabelaId: UUID;
  produtoId: UUID;
  preco: number;
  descontoMaximo: number;
}

export interface PerfilComissao extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  descricao: string;
  status: 'ATIVO' | 'INATIVO';
  regras: {
    funcaoId: number;
    percentual: number;
  }[];
}

export interface PedidoVenda extends Timestamps {
  id: UUID;
  empresaId: UUID;
  numero: string;
  clienteId: UUID;
  vendedorId?: UUID;
  dataEmissao: Date;
  dataEntrega: Date;
  status: 'COTACAO' | 'APROVADO' | 'RESERVADO' | 'FATURADO' | 'CANCELADO';
  descontoPercentual: number;
  descontoValor: number;
  valorTotal: number;
  observacoes?: string;
  itens: {
    produtoId: UUID;
    loteId?: UUID;
    quantidade: number;
    valorUnitario: number;
    desconto: number;
    valorTotal: number;
  }[];
}

export interface DescontoPromocional extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  tipo: 'PERCENTUAL' | 'FIXO';
  valor: number;
  dataInicio: Date;
  dataFim: Date;
  status: 'ATIVO' | 'INATIVO';
  produtosIds?: UUID[];
}

// ==================== MÓDULO FATURAMENTO ====================

export interface Fatura extends Timestamps {
  id: UUID;
  empresaId: UUID;
  pedidoId: UUID;
  numero: string;
  dataEmissao: Date;
  dataVencimento: Date;
  valorTotal: number;
  valorLiquido: number;
  status: 'ABERTA' | 'PAGA' | 'ATRASADA' | 'CANCELADA';
  observacoes?: string;
}

export interface Cobranca extends Timestamps {
  id: UUID;
  empresaId: UUID;
  faturaId: UUID;
  tipo: 'BOLETO' | 'PIX' | 'CARTAO' | 'DINHEIRO';
  codigoBarras?: string;
  linkBoleto?: string;
  valor: number;
  dataVencimento: Date;
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO';
}

// ==================== MÓDULO DOCUMENTOS FISCAIS (NF-e) ====================

export interface NFe extends Timestamps {
  id: UUID;
  empresaId: UUID;
  numero: string;
  serie: string;
  chaveAcesso: string;
  dataEmissao: Date;
  tipo: 'ENTRADA' | 'SAIDA';
  naturezaOperacao: string;
  clienteId?: UUID;
  fornecedorId?: UUID;
  valorTotal: number;
  baseICMS: number;
  valorICMS: number;
  status: 'EMITIDA' | 'CANCELADA' | 'DENEGADA' | 'INUTILIZADA';
  xml: string;
  pdf?: string;
}

export interface ItemNFe {
  id: UUID;
  nfeId: UUID;
  produtoId: UUID;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  baseICMS: number;
  aliquotaICMS: number;
  valorICMS: number;
}

// ==================== MÓDULO FISCAL ====================

export interface CalculoImposto extends Timestamps {
  id: UUID;
  empresaId: UUID;
  tipoDocumento: 'NF-E' | 'NFS-E' | 'CTE';
  documentoId: UUID;
  tipoImposto: 'ICMS' | 'IPI' | 'PIS' | 'COFINS' | 'ISS';
  baseCalculo: number;
  aliquota: number;
  valor: number;
}

export interface RelatorioFiscal extends Timestamps {
  id: UUID;
  empresaId: UUID;
  tipo: 'SPED' | 'FISCAL' | 'APURACAO';
  periodo: string;
  arquivo: string;
  status: 'GERADO' | 'ENVIADO' | 'REJEITADO';
}

// ==================== MÓDULO CONTABILIDADE ====================

export interface PlanoContas extends Timestamps {
  id: UUID;
  empresaId: UUID;
  codigo: string;
  descricao: string;
  tipo: 'ATIVO' | 'PASSIVO' | 'PATRIMONIO_LIQUIDO' | 'RECEITA' | 'DESPESA';
  natureza: 'DEBITO' | 'CREDITO';
  nivel: number;
  paiId?: UUID;
}

export interface OperacaoContabil extends Timestamps {
  id: UUID;
  empresaId: UUID;
  codigo: string;
  descricao: string;
  lancamentoDebito: string;
  lancamentoCredito: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface LancamentoContabil extends Timestamps {
  id: UUID;
  empresaId: UUID;
  data: Date;
  documento: string;
  historico: string;
  valor: number;
  contaDebito: string;
  contaCredito: string;
}

// ==================== MÓDULO FINANCEIRO ====================

export interface ContaPagar extends Timestamps {
  id: UUID;
  empresaId: UUID;
  fornecedorId?: UUID;
  documento: string;
  dataEmissao: Date;
  dataVencimento: Date;
  valorOriginal: number;
  valorJuros: number;
  valorMulta: number;
  valorDesconto: number;
  valorTotal: number;
  status: 'ABERTA' | 'PAGA' | 'ATRASADA' | 'CANCELADA';
  observacoes?: string;
}

export interface ContaReceber extends Timestamps {
  id: UUID;
  empresaId: UUID;
  clienteId?: UUID;
  documento: string;
  dataEmissao: Date;
  dataVencimento: Date;
  valorOriginal: number;
  valorJuros: number;
  valorMulta: number;
  valorDesconto: number;
  valorTotal: number;
  status: 'ABERTA' | 'PAGA' | 'ATRASADA' | 'CANCELADA';
  observacoes?: string;
}

export interface Boleto extends Timestamps {
  id: UUID;
  contaReceberId: UUID;
  banco: string;
  codigoBarras: string;
  linhaDigitavel: string;
  dataEmissao: Date;
  dataVencimento: Date;
  valor: number;
  status: 'GERADO' | 'REMESSA' | 'BAIXADO' | 'CANCELADO';
}

export interface RemessaBanco extends Timestamps {
  id: UUID;
  empresaId: UUID;
  banco: string;
  data: Date;
  arquivo: string;
  quantidade: number;
  valorTotal: number;
}

export interface FluxoCaixa extends Timestamps {
  id: UUID;
  empresaId: UUID;
  data: Date;
  tipo: 'ENTRADA' | 'SAIDA';
  categoria: string;
  descricao: string;
  valor: number;
  saldo: number;
}

// ==================== MÓDULO FINANCEIRO PRO ====================

export interface DRE extends Timestamps {
  id: UUID;
  empresaId: UUID;
  periodo: string;
  receitaBruta: number;
  deducoes: number;
  receitaLiquida: number;
  custoVendas: number;
  lucroBruto: number;
  despesasOperacionais: number;
  lucroOperacional: number;
  despesasFinanceiras: number;
  lucroLiquido: number;
}

export interface MargemProduto extends Timestamps {
  id: UUID;
  empresaId: UUID;
  produtoId: UUID;
  periodo: string;
  receita: number;
  custo: number;
  margemPercentual: number;
  margemValor: number;
}

export interface ProjecaoFinanceira extends Timestamps {
  id: UUID;
  empresaId: UUID;
  mes: string;
  ano: number;
  receitaProjetada: number;
  custoProjetado: number;
  despesaProjetada: number;
  lucroProjetado: number;
}

// ==================== MÓDULO LOGÍSTICA ====================

export interface Rota extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  descricao: string;
  veiculoId: UUID;
  entregadorId: UUID;
  dataRota: Date;
  status: 'ABERTA' | 'EM_ROTA' | 'FINALIZADA' | 'CANCELADA';
}

export interface Veiculo extends Timestamps {
  id: UUID;
  empresaId: UUID;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: 'REFRIGERADO' | 'NORMAL';
  capacidade: number;
  status: 'DISPONIVEL' | 'EM_ROTA' | 'MANUTENCAO';
}

export interface Entrega extends Timestamps {
  id: UUID;
  empresaId: UUID;
  rotaId: UUID;
  pedidoId: UUID;
  clienteId: UUID;
  ordem: number;
  endereco: string;
  latitude?: number;
  longitude?: number;
  status: 'PENDENTE' | 'EM_ROTA' | 'ENTREGUE' | 'CANCELADA';
  dataEntrega?: Date;
  assinatura?: string;
  fotos?: string[];
  observacoes?: string;
}

export interface Entregador extends Timestamps {
  id: UUID;
  empresaId: UUID;
  nome: string;
  cpf: string;
  telefone: string;
  veiculoId?: UUID;
  status: 'ATIVO' | 'INATIVO';
  localizacaoAtual?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
}

// ==================== MÓDULO PATRIMÔNIO ====================

export interface Maquina extends Timestamps {
  id: UUID;
  empresaId: UUID;
  codigo: string;
  nome: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  dataAquisicao: Date;
  valorAquisicao: number;
  vidaUtil: number; // em meses
  deprecicaoMensal: number;
  status: 'ATIVO' | 'MANUTENCAO' | 'INATIVO';
}

export interface Manutencao extends Timestamps {
  id: UUID;
  empresaId: UUID;
  maquinaId: UUID;
  tipo: 'PREVENTIVA' | 'CORRETIVA';
  dataManutencao: Date;
  descricao: string;
  custo: number;
  responsavel: string;
  status: 'REALIZADA' | 'PENDENTE';
}

export interface Depreciacao extends Timestamps {
  id: UUID;
  empresaId: UUID;
  maquinaId: UUID;
  mes: string;
  valorDepreciado: number;
  valorContabil: number;
}

// ==================== MÓDULO SUPORTE ====================

export interface Chamado extends Timestamps {
  id: UUID;
  empresaId: UUID;
  solicitanteId: UUID;
  numero: string;
  titulo: string;
  descricao: string;
  modulo: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABERTO' | 'EM_ATENDIMENTO' | 'AGUARDANDO' | 'RESOLVIDO' | 'FECHADO';
  responsavelId?: UUID;
  dataPrevista: Date;
  dataResolucao?: Date;
  slaHoras: number;
}

export interface HistoricoChamado extends Timestamps {
  id: UUID;
  chamadoId: UUID;
  usuarioId: UUID;
  acao: string;
  observacao: string;
}

// ==================== ESTADOS DA APLICAÇÃO ====================

export interface AppState {
  usuarioLogado?: Usuario;
  empresaAtual?: Empresa;
  permissoes: string[];
  moduloAtivo: string;
}

// ==================== CONFIGURAÇÕES ====================

export const MODULOS = [
  'ADMINISTRATIVO',
  'OPERACIONAL',
  'COMPRAS',
  'ESTOQUE',
  'MANUFATURA',
  'COMERCIAL',
  'FATURAMENTO',
  'DOCUMENTOS_FISCAIS',
  'FISCAL',
  'CONTABILIDADE',
  'FINANCEIRO',
  'FINANCEIRO_PRO',
  'LOGISTICA',
  'MOBILE_LOGISTICA',
  'PATRIMONIO',
  'SUPORTE',
] as const;

export type Modulo = (typeof MODULOS)[number];

export const PERMISSOES = ['CRIAR', 'LER', 'ATUALIZAR', 'DELETAR', 'APROVAR'] as const;
export type Permissao = (typeof PERMISSOES)[number];

// ==================== UTILS ====================

export function generateUUID(): UUID {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
