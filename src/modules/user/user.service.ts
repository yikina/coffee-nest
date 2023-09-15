import { User } from './entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  //注册
  async register(createUser: CreateUserDto) {
    const { username } = createUser;

    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if(existUser){
        throw new HttpException("用户名已存在", HttpStatus.BAD_REQUEST)
    }

    const newUser = await this.userRepository.create(createUser)
    return await this.userRepository.save(newUser);
  }

  //登录
  async login(createUser:CreateUserDto){
    const { username,password } = createUser;
    
    const existUser = await this.userRepository.findOne({
      where: { username }
  });
   
    if(!existUser || !await bcrypt.compare(password,existUser.password)){
      throw new HttpException("用户名或密码错误", HttpStatus.BAD_REQUEST)
    }

    const payload = { sub:existUser.id,username:username }
      return {
        info:existUser,
        accessToken:this.jwtService.sign(payload)
      }
    

}
}

