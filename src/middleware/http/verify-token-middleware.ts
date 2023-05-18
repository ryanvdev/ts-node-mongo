import { NextFunction, Response } from 'express';
import localcrypto from '../../utils/localcrypto';
import locallog from '../../utils/locallog';

export async function verifyAccessTokenMiddleware(
    req: RequestWithToken,
    res: Response,
    next: NextFunction,
) {
    try {
        const { access_token: accessToken } = req.cookies;

        const accessTokenPayload = localcrypto.verifyAccessToken(accessToken);

        if (!accessTokenPayload) {
            res.sendStatus(403).end();
            return;
        }

        req.accessToken = accessTokenPayload;
        next();
        return;
    } catch (e) {
        locallog.log(e);

        res.sendStatus(500).end();
        return;
    }
}

export async function verifyRefreshTokenMiddleware(
    req: RequestWithToken,
    res: Response,
    next: NextFunction,
) {
    try {
        const { refresh_token: refreshToken } = req.cookies;

        const refreshTokenPayload = await localcrypto.verifyRefreshToken(refreshToken);

        if (!refreshTokenPayload) {
            res.sendStatus(403).end();
            return;
        }

        req.refreshToken = refreshTokenPayload;
        next();
        return;
    } catch (e) {
        locallog.log(e);

        res.sendStatus(500).end();
        return;
    }
}
