import { Router } from 'express';
import { checkHealth } from '../controllers/healthzController';

const router = Router();

router.get('/', checkHealth);

export default router;