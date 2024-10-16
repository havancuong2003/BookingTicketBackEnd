import * as Jwt from 'jsonwebtoken';
interface JwtPayload {
  email: string;
  id: number;
  role: number;
  firstName: string;
  exp?: number; // Thêm trường này
}
export const generateToken = (
  user: JwtPayload,
  secret: string,
  tokenLife: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      role: user.role,
    };

    Jwt.sign(payload, secret, { expiresIn: tokenLife }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string); // Ép kiểu token thành chuỗi
      }
    });
  });
};

export const verifyToken = (
  token: string,
  secret: string,
): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    Jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
};

export const getTokenExpirationTime = (
  token: string,
  secret: string,
): Promise<{ exp: number; isExpired: boolean }> => {
  return new Promise((resolve, reject) => {
    Jwt.verify(token, secret, { ignoreExpiration: true }, (err, decoded) => {
      if (err && err.name !== 'TokenExpiredError') {
        reject(err);
      } else {
        const payload = decoded as JwtPayload;
        const now = Math.floor(Date.now() / 1000);
        console.log('Current time:', new Date(now * 1000));
        console.log('Token expiration:', new Date(payload.exp * 1000));
        resolve({
          exp: payload.exp || 0,
          isExpired: (payload.exp || 0) < now,
        });
      }
    });
  });
};
