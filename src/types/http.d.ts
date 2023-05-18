import { NextFunction, Request, Response } from 'express';

export {};

declare global {
    interface AccessTokenPayload {
        userId: string;
    }

    interface RefreshTokenPayload {
        userId: string;
    }

    interface RequestWithToken extends Request {
        accessToken: AccessTokenPayload;
        refreshToken: RefreshTokenPayload;
    }

    interface RequestWithAccessToken extends Request {
        accessToken: AccessTokenPayload;
    }

    interface RequestWithRefreshToken extends Request {
        accessToken: AccessTokenPayload;
    }
}
