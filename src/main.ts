import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true,
    forbidNonWhitelisted: true,
    transformOptions:{
      enableImplicitConversion:true,  //开启自动转换类型
    }
  }))
  app.enableCors({
    origin:'http://localhost:3022'
  })
  await app.listen(3000);
}
bootstrap();
