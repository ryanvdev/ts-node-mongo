import { z } from 'zod';
import g from '../../utils/g';
import { createRequestValidatorMiddleware } from '../../utils/httputils/httputils';
import { User } from '../../database/User/User';
import { Request, Response } from 'express';
import locallog from '../../utils/locallog';

function signInBodyType() {
    return z
        .object({
            username: g.username(),
            password: g.password(),
            twoFactorToken: g.stringInt('Invalid two-factor authentication token'),
        })
        .strict();
}

type SignInBodyType = g.InferFn<typeof signInBodyType>;

export class AuthController {
    private static _instance: AuthController | undefined = undefined;

    protected constructor() {}

    public static async instance(): Promise<AuthController> {
        if (this._instance == null) {
            this._instance = new AuthController();
        }
        return this._instance;
    }

    public readonly signInValidatorMiddleware = createRequestValidatorMiddleware({
        body: [signInBodyType],
    });

    public readonly signInRoute = async (req: Request, res: Response) => {
        try {
            const { username, password, twoFactorToken } = req.body as SignInBodyType;
            const signInResult = await User.signIn({
                username,
                password,
                twoFactorToken,
                // debug: true,
            });

            if (!signInResult) {
                res.sendStatus(403).end();
                return;
            }

            res.cookie('access_token', signInResult.accessToken, {
                httpOnly: true,
                expires: signInResult.accessTokenExpireAt,
            });

            res.cookie('refresh_token', signInResult.refreshToken, {
                httpOnly: true,
                expires: signInResult.refreshTokenExpireAt,
            });

            res.status(200).json(signInResult).end();
            return;
        } catch (e) {
            locallog.log(req.path, '\n', e);
            res.sendStatus(500).end();
            return;
        }
    };

    public readonly signOutRoute = async (req: RequestWithToken, res: Response) => {
        try {
            const success = await User.signOut(req.refreshToken.userId);

            res.clearCookie('access_token');
            res.clearCookie('refresh_token');

            res.status(200)
                .json({
                    success,
                })
                .end();
            return;
        } catch (e) {
            locallog.log(e);

            res.sendStatus(500).end();
            return;
        }
    };
}
