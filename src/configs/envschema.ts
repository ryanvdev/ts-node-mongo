import z from 'zod';
import g from '../utils/g';
import cvtlib from '../utils/cvtlib';

export function envschema() {
    return z.object({
        PORT: z.preprocess(cvtlib.toIntNil, g.port().default(3000).describe('<number>')),
        DEBUG: z.preprocess(
            cvtlib.stringBoolToBoolNil,
            z.boolean().default(false).describe('<boolean|undefined>'),
        ),

        ACCESS_TOKEN_EXPIRE_IN: z.string().default('24h').describe('<string>'),
        REFRESH_TOKEN_EXPIRE_IN: z.string().default('30 days').describe('<string>'),

        //
        SECRET_BASIC_KEY: z.string(),
        SECRET_PASSWORD_KEY: z.string(),
        SECRET_ACCESS_TOKEN_KEY: z.string(),
        SECRET_REFRESH_TOKEN_KEY: z.string(),

        ACCOUNT_ROOT_USERNAME: z.string().default('root'),
        ACCOUNT_ROOT_PASSWORD: z.string().default('root_password'),
        ACCOUNT_ROOT_TWO_FACTOR_SECRET: z.string().default(''),

        // * DATABASE
        DB_PORT: z
            .preprocess(cvtlib.toIntNil, g.port().default(27017))
            .describe(`min 1, max ${2 ** 16 - 1}`),
        DB_HOST: z.string().default('127.0.0.1'),
        DB_USERNAME: z.string().optional(),
        DB_PASSWORD: z.string().optional(),
        DB_DATABASE_NAME: z.string().default('TSNodeMongo'),
    });
}

export type EnvType = g.InferFn<typeof envschema>;
