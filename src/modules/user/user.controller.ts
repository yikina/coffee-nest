import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseInterceptors(ClassSerializerInterceptor)拦截entity中column为exclude的字段，不让其返回
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
    register(@Body() createUser: CreateUserDto) {
      return this.userService.register(createUser);
    }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
   login(@Body() createUser: CreateUserDto){
    return this.userService.login(createUser)
   }
}
