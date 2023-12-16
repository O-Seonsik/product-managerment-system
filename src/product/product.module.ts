import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { TOUR_DB } from '../database/database.constants';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product], TOUR_DB)],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
  exports: [ProductService],
})
export class ProductModule {}
