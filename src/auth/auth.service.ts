import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto';
import * as argon from 'argon2';
import { google } from 'googleapis';
import * as fs from 'fs';
import { UserService } from '../user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly userService: UserService,
  ) {}

  async uploadVideo(accessToken: string, videoPath: string) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      const videoFile = fs.createReadStream(videoPath);

      const response = await drive.files.create({
        requestBody: {
          name: 'Uploaded Video',
          mimeType: 'video/mp4',
          parents: [process.env.FOLDER_ID_UPLOAD_TRAILER],
        },
        media: {
          mimeType: 'video/mp4',
          body: videoFile,
        },
        fields: 'id',
      });

      const fileId = response.data.id;
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      fs.unlinkSync(videoPath);
      return response.data;
    } catch (error) {
      fs.unlinkSync(videoPath); // Xóa file tạm nếu upload thất bại
      console.error('Lỗi khi upload file:', error);

      if (error.code === 403) {
        throw new ForbiddenException('Không có quyền upload vào thư mục này');
      } else if (error.code === 401) {
        throw new ForbiddenException('Token không hợp lệ hoặc đã hết hạn');
      } else if (error.message.includes('File not found')) {
        throw new NotFoundException('Không tìm thấy thư mục để upload');
      } else {
        throw new InternalServerErrorException(
          'Không thể upload file lên Google Drive: ' + error.message,
        );
      }
    }
  }

  async signup(signUpDto: SignUpDto, roleID: number) {
    console.log('signUpDto', signUpDto);

    const userDto: UserDto = {
      email: signUpDto.email,
      hashPass: await argon.hash(signUpDto.password),
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      picture: null,
      roleId: roleID,
      phoneNumber: null,
      isEmailVerified: false,
      verificationToken: null,
      verificationTokenExpires: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    };
    return this.userService.create(userDto);
  }

  async generatePasswordResetToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });

    return token;
  }

  async generateVerificationToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1 * 60 * 1000); // 15 minutes from now

    await this.prisma.user.update({
      where: { email },
      data: {
        verificationToken: token,
        verificationTokenExpires: expires,
      },
    });

    return token;
  }

  async verifyEmail(email: string, token: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    if (user.verificationToken !== token) {
      throw new UnauthorizedException('Invalid verification token');
    }

    if (user.verificationTokenExpires < new Date()) {
      throw new UnauthorizedException('Verification token has expired');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
  }
}
