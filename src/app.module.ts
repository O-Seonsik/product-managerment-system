import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TOUR_DB } from './database/database.constants';
import { Product } from './product/entity/product.entity';
import { Seller } from './seller/entity/seller.entity';
import { Contract } from './reservation/entity/contract.entity';
import { User } from './user/entity/user.entity';
import { ReservationToken } from './reservation/entity/reservation-token.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      name: TOUR_DB,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Product, Seller, User, ReservationToken, Contract],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
