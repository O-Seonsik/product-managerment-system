import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DayOff } from '../entity/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(DayOff)
  @IsOptional()
  dayOff?: DayOff;
}
