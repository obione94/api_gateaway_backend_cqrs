import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { AuthController } from '../controllers/AuthController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.use(cookieParser());

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Exemple route protégée
router.get('/protected', authenticateJWT, (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'Accès autorisé', user });
});

export default router;
