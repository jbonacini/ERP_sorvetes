export class CreateTarefaDto {
    empresaId: string;
    colaboradorId?: string;
    turnoId?: string;
    titulo: string;
    descricao?: string;
    tipo: string;
    prioridade: string;
    status: string;
    dataAgendada: string | Date; // Allow string from JSON
    dataConclusao?: string | Date;
    observacoes?: string;
}
