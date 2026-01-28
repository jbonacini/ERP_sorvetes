
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateDependenteDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    parentesco: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsDateString()
    dataNascimento?: Date;
}

export class CreateColaboradorDto {
    @IsNotEmpty()
    @IsString()
    empresaId: string;

    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsString()
    rg?: string;

    @IsOptional()
    @IsDateString()
    dataNascimento?: Date;

    @IsNotEmpty()
    @IsString()
    cargo: string;

    @IsOptional()
    @IsDateString()
    dataAdmissao?: Date;

    @IsOptional()
    @IsString()
    telefone?: string;

    @IsOptional()
    @IsString()
    celular?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    logradouro?: string;

    @IsOptional()
    @IsString()
    numero?: string;

    @IsOptional()
    @IsString()
    complemento?: string;

    @IsOptional()
    @IsString()
    bairro?: string;

    @IsOptional()
    @IsString()
    cidade?: string;

    @IsOptional()
    @IsString()
    estado?: string;

    @IsOptional()
    @IsString()
    cep?: string;

    @IsOptional()
    @IsString()
    pis?: string;

    @IsOptional()
    @IsString()
    ctps?: string;

    @IsOptional()
    @IsString()
    cnh?: string;

    @IsOptional()
    @IsString()
    cnhCategoria?: string;

    @IsOptional()
    @IsDateString()
    cnhValidade?: Date;

    @IsOptional()
    @IsString()
    funcaoComercialId?: string;

    @IsOptional()
    @IsString()
    fotoUrl?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDependenteDto)
    dependentes?: CreateDependenteDto[];
}
