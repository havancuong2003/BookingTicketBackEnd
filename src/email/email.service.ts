import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { AuthService } from '../auth/auth.service';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private authService: AuthService,
  ) {}

  private async compileTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'email',
      'templates',
      `${templateName}.hbs`,
    );
    console.log('Template path:', templatePath); // Thêm log này để kiểm tra đường dẫn
    const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  async sendForgotPasswordEmail(to: string, token: string) {
    const context = {
      token,

      expirationTime: '24 hours',
      supportEmail: 'support@example.com',
      resetLink: `http://your-frontend-url.com/reset-password?token=${token}`,
    };
    const html = await this.compileTemplate('forgot-password', context);
    await this.mailerService.sendMail({
      to: to,
      subject: 'Password Reset',
      html: html,
    });
  }

  async sendVerificationEmail(to: string, user: User) {
    const verificationToken =
      await this.authService.generateVerificationToken(to);
    const context = {
      token: verificationToken,
      username: user.firstName + ' ' + user.lastName,
      expirationTime: '15 minutes',
      supportEmail: process.env.EMAIL_USER,
      verificationLink: `${process.env.FRONTEND_URL}/verify-email?email=${to}`,
      companyName: 'Your Company Name',
    };
    const html = await this.compileTemplate('verify-account', context);
    await this.mailerService.sendMail({
      to: to,
      subject: 'Verify Your Account',
      html: html,
    });
  }
  async sendPaymentEmail(to: string, paymentInfor: any, paymentDetail: any[]) {
    const context = {
      supportEmail: process.env.EMAIL_USER,
      companyName: 'Your Company Name',
      movieTitle: paymentInfor?.movieTitle,
      roomCode: paymentInfor?.roomCode,
      cinemaName: paymentInfor?.cinemaName,
      paymentDate: paymentInfor?.paymentDate,
      totalAmount: paymentInfor?.totalAmount,
      paymentId: paymentInfor?.paymentId,
      paymentDetail,
    };

    const html = await this.compileTemplate('payment', context);
    await this.mailerService.sendMail({
      to: to,
      subject: 'Payment Successful. Thank you for your purchase!',
      html: html,
    });
  }
}
