import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || 'secret';

const JWT_CONFIG: object = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const createToken = async (data: object) => jwt.sign({ data }, secret, JWT_CONFIG);

const verifyToken = async (token: string) => jwt.verify(token, secret);

export { createToken, verifyToken };
