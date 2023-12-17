import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entity/contract.entity';
import { TOUR_DB } from '../database/database.constants';
import { EntityManager, Equal, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { ReservationToken } from './entity/reservation-token.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectEntityManager(TOUR_DB)
    private readonly tourEntityManager: EntityManager,
    @InjectRepository(Contract, TOUR_DB)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  /**
   * 사용자 상품 예약 조회
   * @param userId
   * @param productId
   */
  findReservationByUserId(userId: number, productId: number) {
    return this.contractRepository.find({
      relations: { product: { seller: true } },
      where: {
        reservationToken: { user: { id: userId } },
        product: { id: productId },
      },
    });
  }

  /**
   * 사용자 상품 예약 목록 조회
   * @param userId
   */
  findReservationListByUserId(userId: number) {
    return this.contractRepository.find({
      relations: { product: true },
      where: { reservationToken: { user: { id: userId } } },
    });
  }

  /**
   * 판매자 상품 예약 확인
   * @param sellerId
   * @param token
   */
  findReservationByToken(sellerId: number, token: string) {
    return this.contractRepository.findOne({
      where: {
        product: { seller: { id: sellerId } },
        reservationToken: { token },
      },
    });
  }

  /**
   * 예약
   * @param productId
   * @param userId
   * @param reservationDate
   */
  async reserve(
    productId: number,
    userId: number,
    reservationDate: dayjs.Dayjs,
  ) {
    // 같은 날짜 예약 여부 확인
    const isReserved = await this.contractRepository.find({
      where: {
        reservationDate: Equal(reservationDate),
        reservationToken: { user: { id: userId } },
      },
    });
    if (isReserved.length) {
      throw new ForbiddenException('이미 같은 날짜에 예약이 존재합니다.');
    }

    return this.tourEntityManager.transaction(async (entityManager) => {
      // repository 생성
      const contractRepository =
        entityManager.getRepository<Contract>(Contract);

      const reservationTokenRepository =
        entityManager.getRepository<ReservationToken>(ReservationToken);

      // 예약 토큰 생성
      const reservationToken = await reservationTokenRepository.save({
        user: { id: userId },
      });

      // contract 생성
      const contract = contractRepository.create({
        product: { id: productId },
        reservationToken,
        reservationDate,
      } as Contract);

      // 상품의 계약 개수 조회
      const count = await contractRepository.count({
        where: {
          product: { id: productId },
          reservationDate: Equal(reservationDate),
        },
      });

      // 일별 상품의 예약 개수가 5개 미만이면 자동승인
      if (count < 5) {
        contract.isConfirmed = true;
      }

      await contractRepository.save(contract);
      return reservationToken;
    });
  }

  /**
   * 예약 취소
   * @param userId
   * @param reservationId
   */
  async cancelReservationByUserId(userId: number, reservationId: number) {
    const contract = await this.contractRepository.findOne({
      where: {
        id: reservationId,
        reservationToken: { user: { id: userId } },
      },
    });

    if (!contract) {
      throw new BadRequestException('일치하는 예약이 없습니다.');
    }
    const now = dayjs();
    const dateDiff = Math.ceil(contract.reservationDate.diff(now, 'day', true));

    // 판매자 승인된 예약의 예약일이 3일이 남지 않은 경우 취소 불가
    if (contract.isConfirmed && dateDiff < 3) {
      throw new ForbiddenException('예약 취소는 3일 전까지 가능합니다.');
    }

    // 취소 일자 추가, 승인 여부 되돌리기
    contract.cancellationDate = now;
    contract.isConfirmed = false;

    return this.contractRepository.save(contract);
  }

  /**
   * 판매자 예약 승인
   * @param sellerId
   * @param reservationToken
   */
  async confirmReservation(sellerId: number, reservationToken: string) {
    const contract = await this.contractRepository.findOne({
      where: {
        reservationToken: { token: reservationToken },
        product: { seller: { id: sellerId } },
      },
    });

    if (!contract) {
      throw new BadRequestException('일치하는 예약이 없습니다.');
    }
    // 취소 이력이 있거나, 승인 이력이 있는 경우
    if (contract?.cancellationDate || contract.isConfirmed) {
      throw new BadRequestException('이미 처리된 예약입니다.');
    }

    // 승인 처리
    contract.isConfirmed = true;
    return this.contractRepository.save(contract);
  }

  /**
   * 판매자 예약 승인 취소
   * @param sellerId
   * @param reservationToken
   */
  async cancelConfirmReservation(sellerId: number, reservationToken: string) {
    const contract = await this.contractRepository.findOne({
      where: {
        reservationToken: { token: reservationToken },
        product: { seller: { id: sellerId } },
      },
    });

    if (!contract) {
      throw new BadRequestException('일치하는 예약이 없습니다.');
    }
    if (contract.cancellationDate ?? false) {
      throw new BadRequestException('이미 미승인 상태입니다.');
    }

    // 취소 이력 추가 및 미승인 처리
    contract.cancellationDate = dayjs();
    contract.isConfirmed = false;
    return this.contractRepository.save(contract);
  }
}
