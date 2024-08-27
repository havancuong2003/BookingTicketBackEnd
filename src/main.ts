import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as session from 'express-session';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000, httpOnly: true, secure: false },
    }),
  );
  app.enableCors({
    origin: 'http://localhost:5173', // Địa chỉ của frontend React
    credentials: true, // Cho phép gửi cookies cùng với yêu cầu
  });

  // Cấu hình ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
