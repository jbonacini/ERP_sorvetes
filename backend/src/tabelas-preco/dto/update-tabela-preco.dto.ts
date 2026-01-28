import { PartialType } from '@nestjs/mapped-types';
import { CreateTabelaPrecoDto } from './create-tabela-preco.dto';

export class UpdateTabelaPrecoDto extends PartialType(CreateTabelaPrecoDto) { }
