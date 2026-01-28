import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTabelaPrecoDto {
    @IsNotEmpty()
    @IsString()
    grupoId: string;

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;

    @IsOptional()
    desconto?: number;

    @IsOptional()
    @IsString()
    atividadeCliente?: string;
}
