import path from 'path';
import z from 'zod';
import fs from 'node:fs';
import zf from '../utils/zf';

function convertToInt(v: any) {
    if (typeof v !== 'string') {
        return undefined;
    }
    return parseInt(v);
}

export function envConfig() {
    return z.object({
        PORT: z.preprocess(convertToInt, zf.port().default(3000)),

        // * DATABASE
        DB_PORT: z.preprocess(convertToInt, zf.port().default(27017)),
        DB_HOST: z.string().default('localhost'),
        DB_USERNAME: z.string().optional(),
        DB_PASSWORD: z.string().optional(),
        DB_DATABASE_NAME: z.string().default('NodeApp'),
    });
}

/**
 *
 * @returns List of env files already exists
 */
export function envFiles(): string[] {
    if (!process.env['NODE_ENV']) {
        process.env['NODE_ENV'] = 'development';
    }

    const NODE_ENV = process.env['NODE_ENV'];
    const envDirectory = path.join(__dirname, '../../env/');

    const results = [
        path.join(envDirectory, '.env'),
        path.join(envDirectory, `.env.${NODE_ENV}`),
    ].filter((filePath) => {
        return fs.existsSync(filePath);
    });

    return results;
}

export type EnvType = z.infer<ReturnType<typeof envConfig>>;
