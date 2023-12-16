import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(private readonly productService: ProductService) {}

  @Get('/:id')
  getProduct(@Param('id') id: number) {
    this.logger.log(`id: ${id}`);
    return this.productService.findOne(+id);
  }

  @Post()
  createProduct(@Body() body: CreateProductDto): Promise<Product> {
    const { name, description } = body;
    this.logger.debug(`name: ${name}, description: ${description}`);
    return this.productService.setOne(name, description);
  }
}
