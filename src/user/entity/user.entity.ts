import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationToken } from '../../reservation/entity/reservation-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment', {
    unsigned: true,
    comment: '사용자 유일식별자',
  })
  id: number;

  @Column({ type: 'varchar', comment: '사용자 이름', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    comment: '사용자 이메일',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    comment: '사용자 비밀번호',
    length: 255,
    select: false,
  })
  password: string;

  @OneToMany(() => ReservationToken, (token) => token.user)
  reservationTokenList: ReservationToken[];
}
