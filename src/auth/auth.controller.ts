import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignInSellerDto } from './dto/sign-in-seller.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 사용자 로그인
   * @param signInDTO
   */
  @Post('user')
  signInUser(@Body() signInDTO: SignInUserDto) {
    return this.authService.signInUser(signInDTO.email, signInDTO.password);
  }

  /**
   * 판매자 로그인
   * @param signInDTO
   */
  @Post('seller')
  signInSeller(@Body() signInDTO: SignInSellerDto) {
    return this.authService.signInSeller(signInDTO.email, signInDTO.password);
  }
}
