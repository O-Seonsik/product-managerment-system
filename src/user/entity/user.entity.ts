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

  @OneToMany(() => ReservationToken, (token) => token.user)
  reservationTokenList: ReservationToken[];
}
