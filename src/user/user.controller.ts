import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthGuard, CurrentUser } from '../auth/guard/user-auth.guard';
import { UserModel } from './model/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 회원가입
   * @param createUserDto
   */
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @UseGuards(UserAuthGuard)
  @Get()
  getUser(@CurrentUser() user: UserModel) {
    return this.userService.findUser(user.email);
  }
}
