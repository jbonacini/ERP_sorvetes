import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoTabelaDto } from './create-grupo-tabela.dto';

export class UpdateGrupoTabelaDto extends PartialType(CreateGrupoTabelaDto) { }
