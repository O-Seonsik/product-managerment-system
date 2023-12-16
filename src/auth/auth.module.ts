import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserAuthGuard } from './guard/user-auth.guard';
import { SellerModule } from '../seller/seller.module';
import { SellerAuthGuard } from './guard/seller-auth.guard';

@Module({
  imports: [
    UserModule,
    SellerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        // 1hour
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserAuthGuard, SellerAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
