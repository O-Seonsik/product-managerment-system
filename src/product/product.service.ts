import { Injectable, Logger } from '@nestjs/common';
import { TOUR_DB } from '../database/database.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(Product, TOUR_DB)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }
  async setOne(name: string, description: string) {
    const product = this.productRepository.create({ name, description });
    return await this.productRepository.save(product);
  }
}
