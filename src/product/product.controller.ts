import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import {
  CurrentSeller,
  SellerAuthGuard,
} from '../auth/guard/seller-auth.guard';
import { SellerModel } from '../seller/model/seller.model';

@Controller('product')
export class ProductController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly productService: ProductService) {}

  /**
   *
   * @param id
   */
  @Get('')
  getProduct(@Param('id') id: number) {
    this.logger.log(`id: ${id}`);
    return this.productService.findOne(+id);
  }
}
