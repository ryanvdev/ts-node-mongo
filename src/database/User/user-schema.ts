import { Schema, SchemaTypes } from 'mongoose';
import g from '../../utils/g';

export interface UserSchema extends RegularCollection {
    username: string;
    password: string;
    twoFactorSecretKey: string;
    refreshTokenHashed?: string;
}

export function createUserSchema() {
    return new Schema<UserSchema>(
        {
            username: {
                type: SchemaTypes.String,
                required: true,
                unique: true,
                validate: {
                    validator: g.isUsername,
                },
            },
            password: {
                type: SchemaTypes.String,
                required: true,
                validate: {
                    validator: g.isPassword,
                },
            },
            twoFactorSecretKey: {
                type: SchemaTypes.String,
                default: '',
            },
            refreshTokenHashed: {
                type: SchemaTypes.String,
                require: false,
            },
        },
        { timestamps: true },
    );
}
