import { Router } from 'express';
import roleController from '../controllers/roleController';

const roleRoutes = Router();


roleRoutes.get('/' ,roleController.getAllUser)
roleRoutes.post('/' ,roleController.createUser)

export default roleRoutes;