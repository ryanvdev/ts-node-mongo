import { z } from 'zod';
import { createZodValidator } from './g.utils';
import { errorUtil } from 'zod/lib/helpers/errorUtil';

// * post
export function port(message?: string) {
    return z
        .number()
        .finite(message)
        .int(message)
        .min(1, message)
        .max(2 ** 16, message);
}

export const isPort = createZodValidator(port());

// * username
export function username(message: errorUtil.ErrMessage = 'username=[a-z0-9]{3,}') {
    return z.string().regex(/^[a-z\d]{3,}$/i, message);
}

export const isUsername = createZodValidator(username());

// * password
export function password(message: errorUtil.ErrMessage = 'password=[a-z0-9!@#$%^&*+-_=/]{8,}') {
    return z.string().regex(/^[a-z\d\!\@\#\$\%\^\&\*\+\-\_\=\/]{8,}$/i, message);
}

export const isPassword = createZodValidator(password());

// * stringInt
export function stringInt(message?: errorUtil.ErrMessage) {
    return z.string().regex(/^[\d]*$/i, message);
}
