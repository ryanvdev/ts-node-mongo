import { z, ZodType, ZodTypeDef } from 'zod';

export function createZodValidator<
    Output = any,
    Def extends ZodTypeDef = ZodTypeDef,
    Input = Output,
>(zodSchema: ZodType<Output, Def, Input>) {
    return (value: unknown): value is z.infer<typeof zodSchema> => {
        return zodSchema.safeParse(value).success;
    };
}
