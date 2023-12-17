import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { ReservationService } from '../reservation/reservation.service';
import { ConfirmReservationDto } from './dto/confirm-reservation.dto';
import { UpdateProductDto } from '../product/dto/update-product.dto';

@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly productService: ProductService,
    private readonly reservationService: ReservationService,
  ) {}

  /**
   * 판매자 회원가입
   * @param createSellerDto
   */
  @Post()
  createSeller(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.createOne(createSellerDto);
  }

  /**
   * 판매자 정보 조회
   * @param seller
   */
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
   * 판매자 상품 예약 조회
   * @param seller
   * @param productId
   */
  @Get('products/:id/tokens')
  @UseGuards(SellerAuthGuard)
  findSellerProductTokenList(
    @CurrentSeller() seller: SellerModel,
    @Param('id') productId: number,
  ) {
    return this.productService.findSellerProductReservationTokenList(
      seller.id,
      productId,
    );
  }

  @Get('reservation/:token')
  @UseGuards(SellerAuthGuard)
  findReservation(
    @CurrentSeller() seller: SellerModel,
    @Param('token') token: string,
  ) {
    return this.reservationService.findReservationByToken(seller.id, token);
  }

  /**
   * 판매자 상품 생성
   * @param seller
   * @param createProductDto
   */
  @Post('product')
  @UseGuards(SellerAuthGuard)
  createProduct(
    @CurrentSeller() seller: SellerModel,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(seller.id, createProductDto);
  }

  /**
   * 판매자의 상품 정보 수정
   * @param seller
   * @param updateProductDto
   */
  @Patch('product')
  @UseGuards(SellerAuthGuard)
  updateProduct(
    @CurrentSeller() seller: SellerModel,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log(seller);
    return this.productService.updateProduct(seller.id, updateProductDto);
  }

  /**
   * 판매자의 상품 예약 관리(승인, 미승인)
   * @param seller
   * @param confirmReservationDto
   */
  @Post('reservation/confirm')
  @UseGuards(SellerAuthGuard)
  confirmReservation(
    @CurrentSeller() seller: SellerModel,
    @Body() confirmReservationDto: ConfirmReservationDto,
  ) {
    const { confirm, reservationToken } = confirmReservationDto;
    // 승인 처리
    if (confirm) {
      return this.reservationService.confirmReservation(
        seller.id,
        reservationToken,
      );
    }

    // 미승인 처리
    return this.reservationService.cancelConfirmReservation(
      seller.id,
      reservationToken,
    );
  }
}
