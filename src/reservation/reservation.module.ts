import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entity/contract.entity';
import { TOUR_DB } from '../database/database.constants';
import { ReservationService } from './reservation.service';
import { ReservationToken } from './entity/reservation-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ReservationToken], TOUR_DB)],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
