import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser'; // Nhập cookie-parser

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Đảm bảo cookie-parser được cấu hình

  app.enableCors({
    origin: process.env.FRONTEND_URL, // Địa chỉ của frontend React
    credentials: true, // Cho phép gửi cookies cùng với yêu cầu
  });

  // Cấu hình ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
