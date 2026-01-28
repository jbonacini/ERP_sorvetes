import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdensServicoDto } from './create-ordens-servico.dto';

export class UpdateOrdensServicoDto extends PartialType(CreateOrdensServicoDto) {}
