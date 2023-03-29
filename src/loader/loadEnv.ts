import fs from 'node:fs';
import { envConfig, envFiles } from '../configs/envConfig';
import * as dotenv from 'dotenv';
import { z } from 'zod';

export async function loadEnv() {
    const envSchema = envConfig();

    // parse all env file
    const envFromFiles = envFiles().reduce((sum, envFilePath) => {
        const envFileData = fs.readFileSync(envFilePath);
        if (envFileData.length == 0) {
            return sum;
        }

        const envConfig = dotenv.parse(envFileData);

        return {
            ...sum,
            ...envConfig,
        };
    }, {} as IndexSignature<string>);

    const rawEnv: IndexSignature<string | undefined> = {};

    for (const schemaKey in envSchema.shape) {
        if (schemaKey in process.env) {
            rawEnv[schemaKey] = process.env[schemaKey];
        } else if (schemaKey in envFromFiles) {
            rawEnv[schemaKey] = envFromFiles[schemaKey];
        } else {
            rawEnv[schemaKey] = undefined;
        }
    }

    try {
        const envChecked = await envSchema.parseAsync(rawEnv);

        Object.freeze(envChecked);
        (globalThis as any).__env = envChecked;
        (global as any).__env = envChecked;
    } catch (e) {
        if (e instanceof z.ZodError) {
            throw new Error(e.message);
        }
        throw e;
    }
}

export default loadEnv;
