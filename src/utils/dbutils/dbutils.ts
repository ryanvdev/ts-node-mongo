import { CompileModelOptions, Schema, model } from 'mongoose';

export function createRegularCollection<T, U, TQueryHelpers = {}>(props: {
    name: string;
    schema: Schema<T, any, any, TQueryHelpers, any, any, any>;
    collection?: string;
    options?: CompileModelOptions;
    statics?: IndexSignature | IndexSignature[];
    middleware?: ((schema: MongooseSchema) => void) | ((schema: MongooseSchema) => void)[];
}): U {
    const { name, schema, collection, options, statics, middleware } = props;

    if (statics) {
        if (Array.isArray(statics)) {
            for (const item of statics) {
                Object.assign(schema.statics, item);
            }
        } else {
            Object.assign(schema.statics, statics);
        }
    }

    if (middleware) {
        if (Array.isArray(middleware)) {
            for (const item of middleware) {
                item(schema);
            }
        } else {
            middleware(schema);
        }
    }

    return model<T, U, TQueryHelpers>(name, schema, collection, options);
}

export async function deleteDoc(deletedBy: ObjectId, doc: RegularDoc) {
    doc.isDeleted = true;
    doc.deletedAt = new Date();
    doc.deletedBy = deletedBy;
    await doc.save();
}
