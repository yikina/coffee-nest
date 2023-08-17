import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UserModule } from './user/user.module';

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
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
