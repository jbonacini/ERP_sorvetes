
import { PartialType } from '@nestjs/mapped-types';
import { CreateFuncaoComercialDto } from './create-funcao-comercial.dto';

export class UpdateFuncaoComercialDto extends PartialType(CreateFuncaoComercialDto) { }
