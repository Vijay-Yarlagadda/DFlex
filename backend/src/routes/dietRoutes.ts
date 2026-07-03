import { Router } from 'express';
import { generateDiet, getDiet, updateProfile, calculatePreview } from '../controllers/dietController';
import { requireUserAuth } from '../middlewares/auth';

const router = Router();

router.post('/calculate', requireUserAuth, calculatePreview);
router.post('/generate-diet', requireUserAuth, generateDiet);
router.get('/diet/:id', requireUserAuth, getDiet);
router.put('/profile', requireUserAuth, updateProfile);

export default router;
