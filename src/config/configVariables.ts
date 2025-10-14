import * as dotenv from 'dotenv';
dotenv.config();

export const connectionDB = process.env.DB_CONNECTION as string;
export const jwt_secret = process.env.JWT_SECRET as string;
export const expires_in = process.env.EXPIRES_IN as string;
