import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtToken';

const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = await verifyToken(token);
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default tokenValidation;
