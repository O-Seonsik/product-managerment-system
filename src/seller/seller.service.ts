import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TOUR_DB } from '../database/database.constants';
import { Seller } from './entity/seller.entity';
import { Repository } from 'typeorm';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellerService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(Seller, TOUR_DB)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  findSeller(email: string): Promise<Seller> {
    return this.sellerRepository.findOne({ where: { email } });
  }

  /**
   * 판매자 생성
   * @param createSellerDto
   */
  async createOne(createSellerDto: CreateSellerDto) {
    try {
      const seller = await this.sellerRepository.save({
        ...createSellerDto,
      });

      const { id, name, email } = seller;
      return {
        id,
        name,
        email,
      };
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('중복되는 이메일이 있습니다.');
      }
      this.logger.log(`[createOne] ${e}`);
      throw new InternalServerErrorException('알 수 없는 오류가 발생했습니다.');
    }
  }
}
