import { generateToken } from './../utils/jwt-helper';
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { GoogleOAuthGuard } from './strategy/google-oauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { RoleService } from 'src/role/role.service';
import { UserDto } from 'src/user/dto/user.dto';
import * as tokenService from '../utils';
interface JwtPayload {
  id: number;
  email: string;
  firstName: string;
  role: number;
}
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

    res.cookie('userGoogleToken', user.accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    const existingUser = await this.userService.findByEmail(user.email);

    let userData: JwtPayload;

    if (existingUser) {
      userData = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        role: existingUser.roleId,
      };
    } else {
      const role = await this.roleService.findRole('user');
      const newUser = await this.userService.create({
        email: user.email,
        hashPass: '',
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        phoneNumber: user.phoneNumber,
        roleId: role.id,
      });

      userData = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        role: newUser.roleId,
      };
    }

    const accessToken = await tokenService.generateToken(
      userData,
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_LIFE,
    );
    const refreshToken = await tokenService.generateToken(
      userData,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFE,
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in a secure, short-lived cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: false, // Allow JavaScript access
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Redirect to frontend without tokens in URL
    const adminRole = await this.roleService.findRole('admin');
    const redirectUrl =
      userData.role === adminRole.id
        ? 'http://localhost:5173/dashboard'
        : 'http://localhost:5173';

    return res.redirect(redirectUrl);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.clearCookie('userGoogleToken');
    return {
      statusCode: 200,
      message: 'Logout successful',
    };
  }

  @Get('token')
  getToken(@Req() req: Request) {
    const accessToken = req.cookies['accessToken']; // Tên cookie có thể thay đổi tùy thuộc vào cách bạn đặt tên
    const userGoogleToken = req.cookies['userGoogleToken'];
    return {
      accessToken: accessToken || null,
      userGoogleToken: userGoogleToken || null,
    };
  }

  @Post('login')
  async login(
    @Body() data: any,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const dataBack = await this.userService.login(data);

    res.cookie('refreshToken', dataBack.token.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    return {
      statusCode: 200,
      message: 'Login successful',
      accessToken: dataBack.token.accessToken, // Trả về access token
    };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const newAccessToken =
        await this.userService.refreshAccessToken(refreshToken);
      return res.json({
        statusCode: 200,
        accessToken: newAccessToken,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string },
  ) {
    const userGoogleToken = req.cookies['userGoogleToken'];

    if (!file) {
      return {
        statusCode: 400,
        message: 'Không có file nào được tải lên',
      };
    }

    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(this.uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, file.buffer);

    if (!userGoogleToken) {
      fs.unlinkSync(filePath); // Xóa file tạm nếu không có token
      return {
        statusCode: 401,
        message: 'Cần có access token',
      };
    }

    try {
      const result = await this.authService.uploadVideo(
        userGoogleToken,
        filePath,
      );
      return {
        statusCode: 200,
        message: 'File đã được tải lên thành công',
        data: result,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        return {
          statusCode: 403,
          message: error.message,
        };
      } else if (error instanceof NotFoundException) {
        return {
          statusCode: 404,
          message: error.message,
        };
      } else if (error instanceof InternalServerErrorException) {
        return {
          statusCode: 500,
          message: error.message,
        };
      } else {
        return {
          statusCode: 500,
          message: 'Đã xảy ra lỗi khi tải file lên: ' + error.message,
        };
      }
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    return `${baseName}-${uniqueSuffix}${ext}`;
  }

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      const role = await this.roleService.findRole('user');
      const newUser = await this.authService.signup(signUpDto, role.id);

      return {
        statusCode: 201,
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.status === 400) {
        throw new BadRequestException(error.response.message);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
