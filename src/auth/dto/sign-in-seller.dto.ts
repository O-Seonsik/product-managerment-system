import { IsString } from 'class-validator';

export class SignInSellerDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
