
import { IsString, IsInt, IsArray, IsOptional, IsNumber, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class ItemPedidoDto {
    @IsString()
    produtoId: string;

    @IsNumber()
    quantidade: number;

    @IsNumber()
    precoUnitario: number;

    @IsNumber()
    @IsOptional()
    desconto?: number;
}

export class CreatePedidoDto {
    @IsString()
    empresaId: string;

    @IsString()
    clienteId: string;

    @IsString()
    @IsOptional()
    vendedorId?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsDateString()
    @IsOptional()
    dataValidade?: string;

    @IsString()
    @IsOptional()
    formaPagamento?: string;

    @IsString()
    @IsOptional()
    observacoes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemPedidoDto)
    itens: ItemPedidoDto[];
}
