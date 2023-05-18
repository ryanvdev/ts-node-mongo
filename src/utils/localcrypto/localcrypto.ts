import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import _ from 'lodash';
import ms from 'ms';
import * as speakeasy from 'speakeasy';
import { User } from '../../database/User/User';

export function randomBytes(size: number = 16, encoding: BufferEncoding = 'hex') {
    return crypto.randomBytes(size).toString(encoding);
}

export interface QuickHashOptions {
    algorithm?: string;
    encoding?: crypto.BinaryToTextEncoding;
}
export function quickHash(value: string | string[], options: QuickHashOptions = {}): string {
    const { algorithm, encoding } = _.defaults(options, {
        algorithm: 'sha256',
        encoding: 'hex',
    } as QuickHashOptions) as Required<QuickHashOptions>;

    const hashObject = crypto.createHash(algorithm);

    if (Array.isArray(value)) {
        for (const item of value) {
            hashObject.update(item);
        }
    } else {
        hashObject.update(value);
    }

    const result = hashObject.digest(encoding);

    // clean
    hashObject.destroy();

    return result;
}

export function hashPassword(value: string): string {
    const { SECRET_PASSWORD_KEY } = __env;
    const hashObject = crypto.createHash('sha256');

    hashObject.update(SECRET_PASSWORD_KEY);
    hashObject.update(value);
    hashObject.update(SECRET_PASSWORD_KEY);
    hashObject.update(value);

    const result = hashObject.digest('hex');

    // clean
    hashObject.destroy();

    return result;
}

export function createAccessToken(payload: AccessTokenPayload): readonly [string, Date] {
    const { SECRET_ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRE_IN } = __env;

    const token = jwt.sign(payload, SECRET_ACCESS_TOKEN_KEY, {
        algorithm: 'HS512',
        expiresIn: ACCESS_TOKEN_EXPIRE_IN,
    });

    return [token, new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRE_IN))] as const;
}

export function createRefreshToken(payload: RefreshTokenPayload): readonly [string, Date] {
    const { SECRET_REFRESH_TOKEN_KEY, REFRESH_TOKEN_EXPIRE_IN } = __env;
    const token = jwt.sign(payload, SECRET_REFRESH_TOKEN_KEY, {
        algorithm: 'HS512',
        expiresIn: REFRESH_TOKEN_EXPIRE_IN,
    });

    return [token, new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRE_IN))] as const;
}

export function verifyAccessToken(token: string): AccessTokenPayload | undefined {
    try {
        if (typeof token !== 'string') {
            return undefined;
        }

        const payload = jwt.verify(token, __env.SECRET_ACCESS_TOKEN_KEY) as AccessTokenPayload;
        return payload;
    } catch (e) {
        return undefined;
    }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | undefined> {
    try {
        if (typeof token !== 'string') {
            return undefined;
        }

        // verify token
        const payload = jwt.verify(token, __env.SECRET_REFRESH_TOKEN_KEY) as RefreshTokenPayload;

        // verify token from database
        const user = await User.findOne({
            _id: new ObjectId(payload.userId),
            refreshTokenHashed: quickHash(token),
        });

        if (!user) return undefined;

        return payload;
    } catch (e) {
        return undefined;
    }
}

export function verifyTwoFactorToken(secretKey: string, token: string): boolean {
    if (secretKey.length === 0 && token.length === 0) return true;

    return speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'base32',
        token,
    });
}
