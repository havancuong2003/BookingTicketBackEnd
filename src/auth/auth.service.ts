import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {  JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService

){}
    async login(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email:dto.email,
            }
        })
        if (!user)throw new ForbiddenException('Credentials incorrect'); 
        const pwMatches = await argon.verify(user.hashPass, dto.password);

        if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
        delete user.hashPass;
        return this.signToken(user.id, user.email);
        ;}

       
    

    async signup(dto: AuthDto) {
        try {
            const hashPass = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
              data: {
                email: dto.email,
                hashPass,
              },
            });
            delete user.hashPass;
            return this.signToken(user.id, user.email);
          } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken');
              }
            }
            throw error;
          }
    }



    async signToken(
            
        userId: number,
        email: string,
        
      ): Promise<{ token: string }> {
         const text= "login success"
        const payload = {
          sub: userId,
          email,
        };
        const secret = this.config.get('JWT_SECRET');
    
        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '15m',
            secret: secret,
          },
          
        );
        console.log(text);
        
       
       return{
        token: token,
       }
        
        ;
       
}
}
