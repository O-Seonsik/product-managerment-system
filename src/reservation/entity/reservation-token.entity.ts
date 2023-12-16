import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Column } from 'typeorm';
import { Contract } from './contract.entity';

@Entity()
export class ReservationToken {
  @PrimaryGeneratedColumn('uuid', {
    comment: '예약 토큰(UUID)',
  })
  token: string;

  @ManyToOne(() => User, (user) => user.reservationTokenList)
  user: User;

  @OneToOne(() => Contract, (contract) => contract.reservationToken)
  contract: Contract;

  @Column({
    type: 'boolean',
    comment: '토큰 만료 여부',
  })
  isExpired: boolean;
}
