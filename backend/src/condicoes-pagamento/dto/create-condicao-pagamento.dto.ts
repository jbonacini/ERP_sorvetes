import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCondicaoPagamentoDto {
    @IsNotEmpty()
    @IsString()
    empresaId: string;

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
