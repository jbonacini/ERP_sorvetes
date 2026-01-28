import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGrupoTabelaDto {
    @IsNotEmpty()
    @IsString()
    empresaId: string;

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}
