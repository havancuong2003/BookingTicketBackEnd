import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { RoleModule } from './role/role.module';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as session from 'express-session';
import { CinemaService } from './cinema/cinema.service';
import { CinemaModule } from './cinema/cinema.module';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';
import { RoomModule } from './room/room.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    MovieModule,
    RoleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
    CinemaModule,
    RoomModule,
    EmailModule,
  ],
  controllers: [UserController, RoomController],
  providers: [
    PrismaService,
    CinemaService,
    UserService,
    RoleService,
    JwtService,
    RoomService,
    EmailService,
    AuthService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret:
            process.env.SESSION_SECRET ||
            'averylogphrasebiggerthanthirtytwochars',
          resave: false,
          saveUninitialized: false,
          cookie: {
            maxAge: 3600000, // 1 hour
          },
        }),
      )
      .forRoutes('*');
  }
}
