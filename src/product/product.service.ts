import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TOUR_DB } from '../database/database.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { DayOff, Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import * as dayjs from 'dayjs';
import { UpdateProductDto } from './dto/update-product.dto';

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

  private getDateList(start: dayjs.Dayjs, end: dayjs.Dayjs) {
    const result: { date: string; day: DayOff }[] = [];
    for (
      let i = start;
      i.isSame(end, 'day') || i.isBefore(end, 'day');
      i = i.add(1, 'day')
    ) {
      result.push({ date: i.format('YYYY-MM-DD'), day: i.day() });
    }
    return result;
  }

  /**
   * 월별 상품 조회(20개씩)
   * @param page
   * @param searchDate
   */
  async findMonthlyProduct(page: number, searchDate: dayjs.Dayjs) {
    const startDate = searchDate.startOf('month');
    const endDate = searchDate.endOf('month');
    const productList = await this.productRepository.find({
      where: {
        startDate: LessThanOrEqual(startDate),
        endDate: MoreThanOrEqual(endDate),
      },
      order: { createdAt: 'ASC' },
      take: 20,
      skip: page * 20,
    });

    // 휴일 필터
    return this.getDateList(startDate, endDate).map(({ date, day }) => {
      const curDateProduct = productList.filter(
        ({ holiday }) =>
          !Boolean(holiday?.day.includes(day)) &&
          !Boolean(holiday?.date.includes(Number.parseInt(date.split('-')[2]))),
      );

      return {
        date,
        curDateProduct,
      };
    });
  }

  /**
   * 판매자의 상품 조회
   * @param sellerId
   */
  findSellerProductList(sellerId: number): Promise<Product[]> {
    return this.productRepository.find({
      relations: { contractList: { reservationToken: true } },
      where: { seller: { id: sellerId } },
    });
  }

  /**
   * 상품의 예약 토큰 조회
   * @param sellerId
   * @param productId
   */
  async findSellerProductReservationTokenList(
    sellerId: number,
    productId: number,
  ) {
    const product = await this.productRepository.find({
      relations: { contractList: { reservationToken: true } },
      where: { seller: { id: sellerId }, id: productId },
    });

    return product.map((product) => {
      const { id, name, description, contractList } = product;
      const tokenList = contractList.map(
        (contract) => contract.reservationToken.token,
      );
      return {
        product: { id, name, description },
        tokenList,
      };
    });
  }

  /**
   * 판매자 상품 생성
   * @param sellerId 판매자 id
   * @param createProductDto
   */
  async createProduct(
    sellerId: number,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { name, description, startDate, endDate, holiday } = createProductDto;
    return this.productRepository.save({
      seller: { id: sellerId },
      name,
      description,
      startDate: dayjs(startDate),
      endDate: dayjs(endDate),
      holiday,
    } as unknown as Product);
  }

  /**
   * 판매자의 상품 정보 수정
   * @param sellerId
   * @param updateProductDto
   */
  async updateProduct(sellerId: number, updateProductDto: UpdateProductDto) {
    const { productId, name, description, startDate, endDate, holiday } =
      updateProductDto;

    const product = await this.productRepository.findOne({
      where: { id: productId, seller: { id: sellerId } },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return this.productRepository.save({
      id: productId,
      name,
      description,
      startDate,
      endDate,
      holiday,
    });
  }
}
