import { IsDateString, IsNumber } from 'class-validator';

export class ReservationProductDto {
  @IsNumber()
  productId: number;

  @IsDateString()
  reservationDate: string;
}
