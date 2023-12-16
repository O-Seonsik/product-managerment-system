import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellerModel } from './model/seller.model';
import {
  CurrentSeller,
  SellerAuthGuard,
} from '../auth/guard/seller-auth.guard';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  createSeller(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.createOne(createSellerDto);
  }

  @UseGuards(SellerAuthGuard)
  @Get()
  getSeller(@CurrentSeller() seller: SellerModel) {
    return this.sellerService.findSeller(seller.email);
  }
}
