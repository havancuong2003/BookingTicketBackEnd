import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
     AuthModule,
      UserModule,
      PrismaModule,
    ],
  controllers: [UserController],
  providers: [PrismaService],
})
export class AppModule {}
