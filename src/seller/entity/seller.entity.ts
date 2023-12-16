import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entity/product.entity';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn('increment', {
    unsigned: true,
    comment: '판매자 유일식별자',
  })
  id: number;

  @Column({ type: 'varchar', comment: '판매자 명', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    comment: '판매자 이메일',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar', comment: '판매자 비밀번호', length: 255 })
  password: string;

  @OneToMany(() => Product, (product) => product.seller)
  productList: Product[];
}
