import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import * as argon2 from 'argon2';
import { RoleService } from 'src/role/role.service';
import { Response, Request } from 'express';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Post('register')
  async register(@Body() data: any) {
    console.log('data:', data);

    const role = await this.roleService.findRole('user');
    const hashpass = await argon2.hash(data.password);
    return await this.userService.create({
      email: data.email,
      hashPass: hashpass,
      firstName: data.firstName,
      lastName: data.lastName,
      picture: null,
      phoneNumber: null,
      roleId: role.id,
    });
  }

  // @Post('login')
  // async login(@Body() data: any, @Req() request: Request) {
  //   const dataBack = await this.userService.login(data);
  //   request.session.accessToken = dataBack.user.token;
  //   console.log('dataBack:', request.session);
  //   return dataBack;
  // }

  // @Get('test')
  // findAll(@Req() request: Request) {
  //   const visits = request.session.visits || 0;
  //   request.session.visits = visits + 1;
  //   console.log('visits:', visits);

  //   return { visits: request.session.visits };
  // }
}
