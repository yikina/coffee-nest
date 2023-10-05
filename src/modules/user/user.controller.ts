import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { Public } from 'src/common/decorator/public.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  //@UseInterceptors(ClassSerializerInterceptor)拦截entity中column为exclude的字段，不让其返回
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  login(@Body() createUser: CreateUserDto) {
    return this.userService.login(createUser)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update')
  update(@Body() updateUser: UserInfoDto) {
    return this.userService.update(updateUser)
  }
}
