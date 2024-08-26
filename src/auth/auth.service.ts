import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
    private config: ConfigService,
  ) {}

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
