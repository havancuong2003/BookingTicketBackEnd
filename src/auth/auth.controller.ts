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
import { EmailService } from 'src/email/email.service';
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
    private readonly emailService: EmailService,
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

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        // User exists but email is not verified
        await this.emailService.sendVerificationEmail(
          existingUser.email,
          existingUser,
        );
        return res.redirect(
          `http://localhost:5173/verify-email?email=${existingUser.email}`,
        );
      }

      // User exists and email is verified, proceed with login
      const userData: JwtPayload = {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        role: existingUser.roleId,
      };

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

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: false,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // Redirect to appropriate page
      const adminRole = await this.roleService.findRole('admin');
      const redirectUrl =
        userData.role === adminRole.id
          ? 'http://localhost:5173/dashboard'
          : 'http://localhost:5173';

      return res.redirect(redirectUrl);
    } else {
      // New user, create account and send verification email
      const role = await this.roleService.findRole('user');
      const newUser = await this.userService.create({
        email: user.email,
        hashPass: '',
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        phoneNumber: user.phoneNumber,
        roleId: role.id,
        isEmailVerified: false,
        verificationToken: null,
        verificationTokenExpires: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      // Send verification email
      await this.emailService.sendVerificationEmail(newUser.email, newUser);

      // Redirect to verification page
      return res.redirect(
        `http://localhost:5173/verify-email?email=${newUser.email}`,
      );
    }
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
    @Body() data: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResult = await this.userService.login(data);

    if (loginResult.statusCode !== 200) {
      return loginResult; // Trả về kết quả lỗi trực tiếp
    }

    // Xử lý đăng nhập thành công
    res.cookie('refreshToken', loginResult.token.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('accessToken', loginResult.token.accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return {
      statusCode: loginResult.statusCode,
      message: loginResult.message,
      accessToken: loginResult.token.accessToken,
      user: loginResult.user,
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
      console.log('newUser', newUser);
      await this.emailService.sendVerificationEmail(newUser.email, newUser);
      return {
        statusCode: 201,
        message:
          'User registered successfully, please check your email to verify your account',
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

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    const user = await this.userService.findByEmail(
      'cuonghvhe176362@fpt.edu.vn',
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.authService.generatePasswordResetToken(user.id);
    await this.emailService.sendForgotPasswordEmail(
      user.email,
      token,
      user.firstName,
    );
    return {
      statusCode: 200,
      message: 'Password reset email sent successfully',
    };
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body() data: { email: string }) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('user', user);

    if (user.isEmailVerified) {
      return {
        statusCode: 400,
        message: 'Email is already verified',
      };
    }
    await this.emailService.sendVerificationEmail(user.email, user);
    return {
      statusCode: 200,
      message: 'Verification email sent successfully',
    };
  }

  @Post('verify-email')
  async verifyEmail(@Body() data: { email: string; token: string }) {
    try {
      const user = await this.userService.findByEmail(data.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.isEmailVerified) {
        return {
          statusCode: 400,
          message: 'Email is already verified',
        };
      }
      await this.authService.verifyEmail(data.email, data.token);
      return {
        statusCode: 200,
        message: 'Email verified successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Post('time-remaining-verify')
  async timeRemainingVerify(@Body() data: { email: string }) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const timeRemaining = user.verificationTokenExpires
      ? Math.max(
          0,
          Math.floor(
            (user.verificationTokenExpires.getTime() - new Date().getTime()) /
              1000,
          ),
        )
      : null;
    return {
      statusCode: 200,
      message: 'Time remaining verify',
      timeRemaining: timeRemaining,
    };
  }
}
