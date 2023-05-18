import { ZodObject, ZodRawShape, ZodTypeAny, z } from 'zod';

export type InferFn<T extends () => ZodTypeAny> = z.infer<ReturnType<T>>;

export type ZodObjectFn<T extends ZodRawShape = any> = () => ZodObject<T>;
