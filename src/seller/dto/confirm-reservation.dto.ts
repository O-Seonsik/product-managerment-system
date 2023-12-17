import { IsBoolean, IsString } from 'class-validator';

export class ConfirmReservationDto {
  @IsString()
  reservationToken: string;

  @IsBoolean()
  confirm: boolean;
}
