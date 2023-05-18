import { Router } from 'express';
import { AuthController } from './AuthController';
import { verifyRefreshTokenMiddleware } from '../../middleware/http/verify-token-middleware';

export default async function loadAuthRouter(parentRouter: Router) {
    const router = Router();

    const controller = await AuthController.instance();

    // prettier-ignore
    router.post(
        '/sign-in',
        controller.signInValidatorMiddleware,
        controller.signInRoute
    );

    // prettier-ignore
    router.post(
        '/sign-out',
        verifyRefreshTokenMiddleware as any,
        controller.signOutRoute as any,
    );

    parentRouter.use('/auth', router);
}
