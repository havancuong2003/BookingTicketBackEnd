import * as Jwt from 'jsonwebtoken';
interface JwtPayload {
  email: string;
  id: number;
  role: number;
  firstName: string;
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
