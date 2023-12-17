import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Holiday } from '../entity/product.entity';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Holiday)
  holiday?: Holiday;
}
