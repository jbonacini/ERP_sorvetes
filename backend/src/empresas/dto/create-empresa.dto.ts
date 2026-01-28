
export class CreateEnderecoDto {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    codigoIbge?: string;
}

export class CreateEmpresaDto {
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    inscricaoEstadual?: string;
    telefone?: string;
    email?: string;
    website?: string;
    status?: string;
    endereco?: CreateEnderecoDto;
}
