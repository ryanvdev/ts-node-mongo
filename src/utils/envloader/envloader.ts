import path from 'node:path';
import fs from 'node:fs';
import { z } from 'zod';
import _ from 'lodash';
import * as dotenv from 'dotenv';
import locallog from '../locallog';
import zodissues from '../zodissues';

function createEnvTemplate(zodSchema: z.ZodTypeAny) {
    const shape = (zodSchema as any).shape;
    const lines: string[] = [];

    for (const key in shape) {
        const optional = shape[key].isOptional();
        const description = shape[key].description || '';
        let evnItem = `${key}=`;

        if (optional) {
            const defaultEnvValue = shape[key].parse(undefined);

            if (defaultEnvValue != null) {
                if (typeof defaultEnvValue === 'string') {
                    evnItem += `'${defaultEnvValue}'`;
                } else {
                    evnItem += defaultEnvValue;
                }
            }
        }

        const markOptional = (optional ? '#* optional' : '#! required').padEnd(13, ' ');
        lines.push(`# ${evnItem.padEnd(70, ' ')} ${markOptional} | ${description}`);
    }

    return lines;
}

export interface LoadEnvFilesOptions {
    /**
     * default: false
     */
    createIfNotExists: boolean;
    envschemaFn: () => z.ZodObject<any>;
}

/**
 *
 * @returns List of env files already exists
 */
function getEnvFiles(absoluteEnvDir: string, options: LoadEnvFilesOptions): string[] {
    const { NODE_ENV } = process.env;
    let envTemplate: string | undefined = undefined;

    const rawPaths = [path.join(absoluteEnvDir, '.env')];

    if (NODE_ENV) {
        rawPaths.push(path.join(absoluteEnvDir, `.env.${NODE_ENV}`));
    }

    if (options.createIfNotExists) {
        if (!fs.existsSync(absoluteEnvDir)) {
            fs.mkdirSync(absoluteEnvDir, { recursive: true });
        }

        rawPaths.forEach((filePath) => {
            if (!fs.existsSync(filePath)) {
                if (envTemplate === undefined) {
                    envTemplate = createEnvTemplate(options.envschemaFn()).join('\n');
                }
                fs.writeFileSync(filePath, envTemplate, { encoding: 'utf8' });
            }
        });

        return rawPaths;
    } else {
        return rawPaths.filter((filePath) => {
            return fs.existsSync(filePath);
        });
    }
}

function loadEnvFromFiles(envFiles: string[]) {
    const results: IndexSignature<string> = {};

    envFiles.forEach((filePath) => {
        const envFileData = fs.readFileSync(filePath, 'utf8');
        if (envFileData.length == 0) return;
        Object.assign(results, dotenv.parse(envFileData));
    });

    return results;
}

export interface ParseEnvOption extends LoadEnvFilesOptions {
    absoluteEnvDir: string;
}

export async function parseEnv(options: ParseEnvOption) {
    const schema = options.envschemaFn();
    const rawEnv: IndexSignature<string | undefined> = {};

    const envKeys = Object.keys(schema.shape);
    const envFromFiles = loadEnvFromFiles(getEnvFiles(options.absoluteEnvDir, { ...options }));
    const envFromProcess = _.pick(process.env, envKeys);

    Object.assign(rawEnv, envFromFiles, envFromProcess);

    try {
        const envChecked = await schema.parseAsync(rawEnv);

        Object.freeze(envChecked);
        (globalThis as any).__env = envChecked;
        (global as any).__env = envChecked;
    } catch (e) {
        if (e instanceof z.ZodError) {
            locallog.object(zodissues.toIssuesTypeOne(e.issues));
            throw new Error('Invalid environment variables');
        } else {
            throw e;
        }
    }
}
