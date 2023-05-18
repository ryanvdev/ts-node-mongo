import { Router } from 'express';
import loadAuthRouter from './AuthController';
import loadAdminRouter from './admin-router';

export async function createControllerRouter() {
    const router = Router();
    await loadAuthRouter(router);
    await loadAdminRouter(router);
    return router;
}
