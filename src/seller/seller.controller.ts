import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellerModel } from './model/seller.model';
import {
  CurrentSeller,
  SellerAuthGuard,
} from '../auth/guard/seller-auth.guard';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { Product } from '../product/entity/product.entity';

@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  createSeller(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.createOne(createSellerDto);
  }

  @Get()
  @UseGuards(SellerAuthGuard)
  getSeller(@CurrentSeller() seller: SellerModel) {
    return this.sellerService.findSeller(seller.email);
  }

  /**
   * 판매자 상품 목록 조회
   * @param seller
   */
  @Get('products')
  @UseGuards(SellerAuthGuard)
  findSellerProduct(@CurrentSeller() seller: SellerModel) {
    return this.productService.findSellerProductList(seller.id);
  }

  /**
   * 판매자 상품 생성
   * @param seller
   * @param body
   */
  @Post('product')
  @UseGuards(SellerAuthGuard)
  createProduct(
    @CurrentSeller() seller: SellerModel,
    @Body() body: CreateProductDto,
  ): Promise<Product> {
    const { name, description, dayOff } = body;
    return this.productService.createProduct(
      seller.id,
      name,
      description,
      dayOff,
    );
  }
}
