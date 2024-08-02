import { Router } from 'express';

import authRoute from './authRoute';
import roleRoute from './roleRoute';

const rootRouter = Router();
rootRouter.use('/auth', authRoute);
rootRouter.use('/role', roleRoute);

export default rootRouter;