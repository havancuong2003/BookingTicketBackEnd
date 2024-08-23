import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { google } from 'googleapis';
import * as fs from 'fs';
@Injectable()
export class AuthService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // async signup(dto: AuthDto) {
  //   try {
  //     const hashPass = await argon.hash(dto.password);
  //     const user = await this.prisma.user.create({
  //       data: {
  //         email: dto.email,
  //         hashPass,
  //       },
  //     });
  //     delete user.hashPass;
  //     return this.signToken(user.id, user.email);
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       if (error.code === 'P2002') {
  //         throw new ForbiddenException('Credentials taken');
  //       }
  //     }
  //     throw error;
  //   }
  // }

  async signToken(userId: number, email: string): Promise<{ token: string }> {
    const text = 'login success';
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    console.log(text);

    return {
      token: token,
    };
  }

  async uploadVideo(accessToken: string, videoPath: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: this.oauth2Client });

    const videoFile = fs.createReadStream(videoPath);

    const response = await drive.files.create({
      requestBody: {
        name: 'Uploaded Video',
        mimeType: 'video/mp4', // Cần thay đổi nếu video có định dạng khác
        parents: ['1zX4fQI_q9-NFlpCSPW2WkhP7OuCaQKAO'],
      },
      media: {
        mimeType: 'video/mp4', // Cần thay đổi nếu video có định dạng khác
        body: videoFile,
      },
      fields: 'id', // Trả về ID của file sau khi upload
    });

    const fileId = response.data.id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    fs.unlinkSync(videoPath); // Xóa file sau khi upload

    return response.data;
  }
}
