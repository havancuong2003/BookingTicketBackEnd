// types/express-session.d.ts
import * as session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    accessToken?: string; // Thêm thuộc tính accessToken vào SessionData
  }
}
