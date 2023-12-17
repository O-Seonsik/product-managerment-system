import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthGuard, CurrentUser } from '../auth/guard/user-auth.guard';
import { UserModel } from './model/user.model';
import { ReservationProductDto } from './dto/reservation-product.dto';
import { ReservationService } from '../reservation/reservation.service';
import * as dayjs from 'dayjs';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly reservationService: ReservationService,
  ) {}

  /**
   * 회원가입
   * @param createUserDto
   */
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  getUser(@CurrentUser() user: UserModel) {
    return this.userService.findUser(user.email);
  }

  @Get('/reservation')
  @UseGuards(UserAuthGuard)
  getReservationList(@CurrentUser() user: UserModel) {
    return this.reservationService.findReservationListByUserId(user.id);
  }

  @Get('/reservation/:productId')
  @UseGuards(UserAuthGuard)
  getReservation(
    @CurrentUser() user: UserModel,
    @Param('productId') productId: number,
  ) {
    return this.reservationService.findReservationByUserId(user.id, productId);
  }

  @Post('/reservation')
  @UseGuards(UserAuthGuard)
  reserve(
    @CurrentUser() user: UserModel,
    @Body() reservationProductDto: ReservationProductDto,
  ) {
    return this.reservationService.reserve(
      reservationProductDto.productId,
      user.id,
      dayjs(reservationProductDto.reservationDate),
    );
  }

  @Delete('/reservation/:id')
  @UseGuards(UserAuthGuard)
  deleteReservation(
    @CurrentUser() user: UserModel,
    @Param('id') reservationId: number,
  ) {
    return this.reservationService.cancelReservationByUserId(
      user.id,
      reservationId,
    );
  }
}
