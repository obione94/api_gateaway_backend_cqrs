import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'username et password requis' });
      return;
    }
    try {
      await authService.register(username, password);
      res.status(201).json({ message: 'Utilisateur créé' });
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'username et password requis' });
      return;
    }
    const result = await authService.login(username, password);
    if (!result) {
      res.status(400).json({ message: 'Identifiants invalides' });
      return;
    }
    // Set refreshToken cookie HttpOnly
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: result.accessToken });
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      res.status(401).json({ message: 'Refresh token manquant' });
      return;
    }
    const ip = req.ip || null;
    const userAgent = req.headers['user-agent'] || null;
    const result = await authService.refresh(oldRefreshToken, ip, userAgent);
    if (!result) {
      res.status(401).json({ message: 'Refresh token invalide ou expiré' });
      return;
    }
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: result.accessToken });
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Déconnecté avec succès' });
  }
}

