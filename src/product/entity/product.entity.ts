import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { DayjsTransformer } from '../../database/transformer/dayjs.transformer';
import { Seller } from '../../seller/entity/seller.entity';
import { Contract } from '../../reservation/entity/contract.entity';

export enum DayOff {
  SUN,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment', {
    unsigned: true,
    comment: '상품 유일식별자',
  })
  id: number;

  @ManyToOne(() => Seller, (seller) => seller.productList)
  seller: Seller;

  @OneToMany(() => Contract, (contract) => contract.product)
  contractList: Contract[];

  @Column({ type: 'varchar', comment: '상품명', length: 255 })
  name: string;

  @Column({ type: 'text', comment: '상품 설명' })
  description: string;

  @Column({
    type: 'datetime',
    comment: '상품 등록 일시',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: DayjsTransformer,
  })
  createdAt: dayjs.Dayjs;

  /**
   * TODO. 휴일인데 이거 스키마 고려해야할 것
   *  날짜별, 요일별 두개 컬럼 별도로 사용해도 괜찮을 것으로 보임
   *  현재는 휴일 테이블 별도로 만들고 하루씩 추가하도록 할 예정
   *  추후 재정의 예정
   */
  @Column({ type: 'enum', enum: DayOff, nullable: true })
  dayOff?: DayOff;
}
