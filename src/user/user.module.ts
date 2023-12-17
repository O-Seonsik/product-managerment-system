import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TOUR_DB } from '../database/database.constants';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [TypeOrmModule.forFeature([User], TOUR_DB), ReservationModule],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
