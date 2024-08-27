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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    MovieModule,
    RoleModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [PrismaService, UserService, RoleService, JwtService],
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
