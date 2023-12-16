import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sellerService: SellerService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 사용자 로그인
   * @param email
   * @param password
   */
  async signInUser(email: string, password: string) {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new NotFoundException('email 혹은 password 를 확인하세요');
    }

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      id: user.id,
      name: user.name,
      role: 'user',
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * 판매자 로그인
   * @param email
   * @param password
   */
  async signInSeller(email: string, password: string) {
    const seller = await this.sellerService.findSeller(email);
    if (!seller) {
      throw new NotFoundException('email 혹은 password 를 확인하세요');
    }

    if (seller?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: seller.id,
      id: seller.id,
      name: seller.name,
      role: 'seller',
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
