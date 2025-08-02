import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../infrastructure/security/jwt';

export async function authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token manquant' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token mal formé' });
    return;
  }

  const username = verifyAccessToken(token);
  if (!username) {
    res.status(403).json({ message: 'Token invalide ou expiré' });
    return;
  }

  (req as any).user = username; // ou étendre interface Request
  next();
}
