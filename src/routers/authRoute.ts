import { Router } from 'express';
import authController from '../controllers/authController';
import isAuthenticated from '../middlewares/isAuthenticated';

const authRoutes = Router();


authRoutes.post('/singup' ,isAuthenticated,authController.registrtion)
authRoutes.post('/login' ,authController.login)
authRoutes.get('/' ,authController.getAllUser)

export default authRoutes;