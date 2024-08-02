import { Router } from 'express';

import authRoute from './authRoute';

const rootRouter = Router();
rootRouter.use('/auth', authRoute);

export default rootRouter;