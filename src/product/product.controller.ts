import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import * as dayjs from 'dayjs';

@Controller('product')
export class ProductController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly productService: ProductService) {}

  /**
   * 0 페이지부터 조회
   * @param searchYearMonth
   * @param page
   */
  @Get('/:searchYearMonth/:page')
  getProduct(
    @Param('searchYearMonth') searchYearMonth: string,
    @Param('page') page: number,
  ) {
    return this.productService.findMonthlyProduct(page, dayjs(searchYearMonth));
  }
}
