import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TOUR_DB } from '../database/database.constants';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(User, TOUR_DB)
    private readonly userRepository: Repository<User>,
  ) {}

  findUser(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * 인증용 password 포함 조회
   * @param email
   */
  findUserWithPassword(email: string): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'name', 'email', 'password'],
      where: { email },
    });
  }

  /**
   * 사용자 생성
   * @param createUserDto
   */
  async createOne(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.save({
        ...createUserDto,
      });

      const { id, name, email } = user;
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
