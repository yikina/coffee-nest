import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './modules/coffees/coffees.module';
import { PicSignModule } from './modules/pic_sign/pic_sign.module';
import { UserModule } from './modules/user/user.module';
import { NotesModule } from './modules/notes/notes.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtUserGuard } from './modules/user/user.jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'pass322',
      autoLoadEntities:true,
      synchronize:true
    }),
    CoffeesModule,
    UserModule,
    PicSignModule,
    NotesModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtUserGuard
    }],
})
export class AppModule {}
