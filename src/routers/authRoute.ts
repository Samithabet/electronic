import { Router } from 'express';
import authController from '../controllers/authController';

const authRoutes = Router();


authRoutes.post('/singup' ,authController.registrtion)
authRoutes.get('/' ,authController.getAllUser)

export default authRoutes;