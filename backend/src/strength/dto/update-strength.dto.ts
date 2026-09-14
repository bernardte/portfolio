import { PartialType } from '@nestjs/mapped-types';
import { CreateStrengthDto } from './create-strength.dto';

export class UpdateStrengthDto extends PartialType(CreateStrengthDto) {}
