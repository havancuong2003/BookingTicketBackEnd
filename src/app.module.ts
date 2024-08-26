import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { RoleModule } from './role/role.module';
import { CinemaService } from './cinema/cinema.service';
import { CinemaModule } from './cinema/cinema.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
     AuthModule,
      UserModule,
      PrismaModule,
      MovieModule,
      RoleModule,
      CinemaModule,
    ],
  controllers: [UserController],
  providers: [PrismaService, CinemaService],
})
export class AppModule {}
