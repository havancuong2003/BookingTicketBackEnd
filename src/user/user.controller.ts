import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import * as argon2 from 'argon2';
import { RoleService } from 'src/role/role.service';
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

  @Post('login')
  async login(@Body() data: any) {
    return await this.userService.login(data);
  }
}
