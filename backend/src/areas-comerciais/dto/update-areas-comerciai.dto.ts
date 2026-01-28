import { PartialType } from '@nestjs/mapped-types';
import { CreateAreasComerciaiDto } from './create-areas-comerciai.dto';

export class UpdateAreasComerciaiDto extends PartialType(CreateAreasComerciaiDto) {}
