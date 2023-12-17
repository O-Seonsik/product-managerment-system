import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { DayjsDatetimeTransformer } from '../../database/transformer/dayjsDatetimeTransformer';
import { Seller } from '../../seller/entity/seller.entity';
import { Contract } from '../../reservation/entity/contract.entity';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum DayOff {
  SUN,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
}

export class Holiday {
  @IsEnum(DayOff, { each: true })
  @IsArray()
  @IsOptional()
  day?: DayOff[];

  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(31, { each: true })
  @IsArray()
  @IsOptional()
  date?: number[];
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
    transformer: DayjsDatetimeTransformer,
  })
  createdAt: dayjs.Dayjs;

  @Column({
    type: 'date',
    name: 'start_date',
    comment: '상품 판매 시작일',
    transformer: DayjsDatetimeTransformer,
  })
  startDate: dayjs.Dayjs;

  @Column({
    type: 'date',
    name: 'end_date',
    comment: '상품 판매 종료일',
    transformer: DayjsDatetimeTransformer,
  })
  endDate: dayjs.Dayjs;

  @Column({ type: 'json', name: 'holiday', nullable: true })
  holiday?: Holiday;
}
