import * as dayjs from 'dayjs';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import {
  DayjsDateTransformer,
  DayjsDatetimeTransformer,
} from '../../database/transformer/dayjsDatetimeTransformer';
import { ReservationToken } from './reservation-token.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('increment', {
    unsigned: true,
    comment: '계약 유일식별자',
  })
  id: number;

  @ManyToOne(() => Product, (product) => product.contractList)
  product: Product;

  @OneToOne(() => ReservationToken, ({ token }) => token)
  @JoinColumn()
  reservationToken: ReservationToken;

  @Column({
    type: 'datetime',
    comment: '계약 체결 일시',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: DayjsDatetimeTransformer,
  })
  createdAt: dayjs.Dayjs;

  @Column({
    type: 'date',
    comment: '투어 예약일',
    transformer: DayjsDateTransformer,
  })
  reservationDate: dayjs.Dayjs;

  @Column({
    type: 'datetime',
    comment: '투어 예약 취소일시',
    transformer: DayjsDatetimeTransformer,
    nullable: true,
  })
  cancellationDate: dayjs.Dayjs;

  @Column({
    type: 'boolean',
    comment: '예약 승인 여부',
    default: () => false,
  })
  isConfirmed: boolean;
}
