import { Injectable, Logger } from '@nestjs/common';
import { TOUR_DB } from '../database/database.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DayOff, Product } from './entity/product.entity';

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

  /**
   * 판매자의 상품 조회
   * @param sellerId
   */
  async findSellerProductList(sellerId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { seller: { id: sellerId } },
    });
  }

  /**
   * 판매자 상품 생성
   * @param sellerId 판매자 id
   * @param name 상품명
   * @param description 상품설명
   * @param dayOff 상품 휴일(요일)
   */
  async createProduct(
    sellerId: number,
    name: string,
    description: string,
    dayOff?: DayOff,
  ): Promise<Product> {
    return this.productRepository.save({
      seller: { id: sellerId },
      name,
      description,
      dayOff,
    } as Product);
  }
}
