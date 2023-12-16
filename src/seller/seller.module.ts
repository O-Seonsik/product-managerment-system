import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entity/seller.entity';
import { TOUR_DB } from '../database/database.constants';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seller], TOUR_DB), ProductModule],
  controllers: [SellerController],
  providers: [SellerService, JwtService],
  exports: [SellerService],
})
export class SellerModule {}
