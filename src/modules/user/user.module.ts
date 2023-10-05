import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import JwtUserStrategy from './user.jwt.strategy';


@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:""+process.env.jwt_secret,
      signOptions:{expiresIn:'1d'}

    })],
  controllers: [UserController],
  providers: [UserService,JwtUserStrategy],
})
export class UserModule {}
