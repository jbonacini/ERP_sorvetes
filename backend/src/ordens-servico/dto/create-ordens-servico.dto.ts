export class CreateOrdensServicoDto {
    empresaId: string;
    clienteId: string;
    colaboradorId?: string;
    numero?: number; // Optional as we auto-generate
    status: string;
    prioridade: string;
    descricao?: string;
    dataAbertura: string | Date;
    dataFechamento?: string | Date;
    valorTotal?: number;
}
