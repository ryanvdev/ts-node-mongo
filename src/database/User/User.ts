import { Document, Model } from 'mongoose';
import { UserSchema, createUserSchema } from './user-schema';
import userStatic, { UserStatics } from './userStatics';
import { createRegularCollection } from '../../utils/dbutils';

export interface UserModel extends Model<UserSchema>, UserStatics {}

export type UserDoc = Document<unknown, {}, UserSchema> &
    Omit<
        UserSchema &
            Required<{
                _id: ObjectId;
            }>,
        never
    >;

export const User = createRegularCollection<UserSchema, UserModel>({
    name: 'user',
    schema: createUserSchema(),
    statics: userStatic,
});
