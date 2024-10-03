import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as moment from 'moment-timezone'; // Sử dụng moment-timezone để đảm bảo múi giờ chính xác
import * as querystring from 'qs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VnpayService {
  constructor(private configService: ConfigService) {}

  createPaymentUrl(amount: number, ipAddr: string, orderInfo: string) {
    const secretKey = this.configService.get<string>('vnp_HashSecret');
    const tmnCode = this.configService.get<string>('vnp_TmnCode');
    const returnUrl = this.configService.get<string>('vnp_ReturnUrl');
    let vnpUrl = this.configService.get<string>('vnp_Url');

    const date = new Date();
    const createDate = moment
      .tz(date, 'Asia/Ho_Chi_Minh')
      .format('YYYYMMDDHHmmss'); // Thiết lập múi giờ
    const orderId = moment().format('DDHHmmss');

    const currCode = 'VND';
    let vnp_Params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: encodeURIComponent(returnUrl),
      vnp_IpAddr: encodeURIComponent(ipAddr),
      vnp_CreateDate: createDate,
    };

    // Sắp xếp các tham số theo thứ tự chữ cái
    vnp_Params = this.sortObject(vnp_Params);

    // Tạo chữ ký HMAC SHA512
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    // Xây dựng URL thanh toán
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return {
      url: vnpUrl,
      sig: signed,
    };
  }

  private sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  verifyPayment(query: any): { isValid: boolean; responseCode: string } {
    const vnp_SecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash; // Bỏ chữ ký cũ để tạo lại chữ ký

    const sortedParams = this.sortObject(query);
    const secretKey = this.configService.get<string>('vnp_HashSecret');
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return {
      isValid: vnp_SecureHash === signed,
      responseCode: query.vnp_ResponseCode,
    };
  }
}
