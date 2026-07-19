import express from 'express';
import * as dietController from '../controllers/diet.controller';
import { validate } from '../middlewares/validate.middleware';
import { ProfileSchema } from '../validators/diet.validator';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/calculate', authMiddleware, validate(ProfileSchema), dietController.calculatePreview);
router.post('/generate-diet', authMiddleware, validate(ProfileSchema), dietController.generateDiet);
router.get('/diet', authMiddleware, dietController.getDiet);
router.get('/profile', authMiddleware, dietController.getProfile);
router.put('/profile', authMiddleware, dietController.updateProfile);

export default router;
