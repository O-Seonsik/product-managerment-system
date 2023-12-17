import { IsDateString, IsString } from 'class-validator';

export class FindProductDto {
  // @IsDateString()
  @IsString()
  searchYearMonth: string;
}
