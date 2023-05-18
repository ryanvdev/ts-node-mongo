import { Document, Schema, Types } from 'mongoose';

export {};

declare global {
    class ObjectId extends Types.ObjectId {}

    interface RegularCollection {
        _id: ObjectId;

        isDeleted: boolean;
        deletedBy?: ObjectId;
        deletedAt?: Date;

        createdAt: Date;
        updatedAt: Date;
    }

    type RegularDoc<SchemaType extends RegularCollection = RegularCollection> = Document<
        unknown,
        {},
        SchemaType
    > &
        Omit<
            SchemaType &
                Required<{
                    _id: ObjectId;
                }>,
            never
        >;

    type MongooseSchema<T = any, TQueryHelpers = any> = Schema<
        T,
        any,
        any,
        TQueryHelpers,
        any,
        any,
        any
    >;
}
