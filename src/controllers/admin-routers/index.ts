import { Router } from 'express';
import loadSampleRouter from './SampleController';
import { verifyAccessTokenMiddleware } from '../../middleware/http/verify-token-middleware';

export default async function loadAdminRouter(parentRouter: Router) {
    const router = Router();

    await loadSampleRouter(router);

    // prettier-ignore
    parentRouter.use(
        '/admin',
        verifyAccessTokenMiddleware as any,
        router
    );
}
