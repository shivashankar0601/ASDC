import { PartialType } from '@nestjs/swagger';
import { CreatePropertyImageDto } from './create-property-image.dto';

export class UpdatePropertyImageDto extends PartialType(CreatePropertyImageDto) {}
