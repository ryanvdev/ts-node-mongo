import { z } from 'zod';

export type InferFunction<T extends () => z.ZodTypeAny> = z.infer<ReturnType<T>>;

export function makeValidateFn(zv: z.ZodTypeAny) {
    return (v: unknown): v is z.infer<typeof zv> => {
        return zv.safeParse(v).success;
    };
}

export function port(message?: string) {
    return z
        .number()
        .finite(message)
        .int(message)
        .min(1, message)
        .max(2 ** 16, message);
}

export const isPort = makeValidateFn(port());
