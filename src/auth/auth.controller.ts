import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { GoogleOAuthGuard } from './strategy/google-oauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { RoleService } from 'src/role/role.service';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private readonly uploadDir = path.join(__dirname, '../../uploads');

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {
    return 'redirect';
  }

  @Get('callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const existingUser = await this.userService.findByEmail(user.email);
    req.session.accessToken = user.accessToken;

    if (existingUser) {
      const updateData: Partial<UserDto> = {};
      if (existingUser.firstName !== user.firstName)
        updateData.firstName = user.firstName;
      if (existingUser.lastName !== user.lastName)
        updateData.lastName = user.lastName;
      if (existingUser.picture !== user.picture)
        updateData.picture = user.picture;

      if (Object.keys(updateData).length > 0) {
        await this.userService.update(existingUser.id, updateData);
      }

      const userRole = await this.userService.checkRoleLoginGG(user.email);
      req.session.role = userRole; // Lưu role vào session

      if (userRole === 'admin') {
        return res.redirect('http://localhost:5173/dashboard');
      } else {
        return res.redirect('http://localhost:5173');
      }
    } else {
      const role = await this.roleService.findRole('user');
      await this.userService.create({
        email: user.email,
        hashPass: '', // hoặc bỏ qua nếu không có mật khẩu
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        phoneNumber: user.phoneNumber,
        roleId: role.id,
      });

      req.session.role = 'user'; // Hoặc role được xác định khác

      return res.redirect('http://localhost:5173');
    }
  }

  @Get('token')
  getToken(@Req() req: Request, @Session() session: Record<string, any>) {
    const accessToken = session.accessToken;
    const role = session.role;
    return {
      accessToken: accessToken || null,
      role: role || null,
    };
  }

  @Post('login')
  async login(@Body() data: any, @Session() session: Record<string, any>) {
    const dataBack = await this.userService.login(data);
    session.accessToken = dataBack.user.token;
    session.role = dataBack.user.role; // Lưu role vào session
    return dataBack;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string },
  ) {
    const authorizationHeader = req.headers['authorization'];
    const accessToken = authorizationHeader?.split(' ')[1];

    // Kiểm tra file upload
    if (!file) {
      return {
        statusCode: 400,
        message: 'No file uploaded',
      };
    }
    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(this.uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, file.buffer);

    if (!accessToken) {
      return {
        statusCode: 401,
        message: 'Access token is required',
      };
    }

    const result = await this.authService.uploadVideo(accessToken, filePath);
    return result;
  }

  private generateUniqueFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    return `${baseName}-${uniqueSuffix}${ext}`;
  }

  //   @Post('signup')
  //   signup(@Body() dto: AuthDto) {
  //     return this.authService.signup(dto);
  //   }
}
