import { IsEmail, IsString } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
