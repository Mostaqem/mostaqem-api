import { PartialType } from '@nestjs/mapped-types';
import { CreateReciterDto } from './create-reciter.dto';

export class UpdateReciterDto extends PartialType(CreateReciterDto) {}
