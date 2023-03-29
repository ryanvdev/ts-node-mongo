import { EnvType } from '../configs/envConfig';

export {};

declare global {
    interface IndexSignature<T = any> {
        [KEY: string]: T;
    }

    const __env: Readonly<EnvType>;
}
