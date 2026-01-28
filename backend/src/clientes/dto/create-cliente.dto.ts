export class CreateClienteDto {
    empresaId: string;
    areaComercialId?: string; // Renomeado de areaId
    grupoTabelaPrecoId?: string;
    condicaoPagamentoId?: string; // ID único para simplificar cadastro inicial
    tipo: string;
    nomeFantasia: string;
    razaoSocial?: string;
    cpfCnpj: string;
    rgInscricao?: string;
    email?: string;
    telefone?: string;
    celular?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    status?: string;
    limiteCredito?: number;
}
