import { User, UserDoc } from './User';
import localcrypto from '../../utils/localcrypto';
import locallog from '../../utils/locallog';
import { UserSchema } from './user-schema';

export interface SignInProps {
    username: string;
    password: string;
    twoFactorToken: string;
    debug?: boolean;
}

export type SignInReturn = {
    userId: string;
    accessToken: string;
    accessTokenExpireAt: Date;
    refreshToken: string;
    refreshTokenExpireAt: Date;
};

const signIn = async (props: SignInProps): Promise<SignInReturn | undefined> => {
    const { username, password, twoFactorToken, debug } = props;
    try {
        //* @debug
        if (debug) locallog.log('Finding user...');

        const user = await User.findOne({
            username: username,
        });

        // Not correct username
        if (!user) return undefined;

        //* @debug
        if (debug) locallog.log('Found user');

        // Not correct password
        if (user.password !== localcrypto.hashPassword(password)) {
            return undefined;
        }

        //* @debug
        if (debug) locallog.log('Correct password');

        const { twoFactorSecretKey, _id } = user;

        // Invalid token
        if (
            (twoFactorSecretKey.length !== 0 && twoFactorToken.length === 0) ||
            (twoFactorSecretKey.length === 0 && twoFactorToken.length !== 0)
        ) {
            return undefined;
        }

        //* @debug
        if (debug) locallog.log('Two-factor check-1 passed');

        if (!localcrypto.verifyTwoFactorToken(twoFactorSecretKey, twoFactorToken)) {
            return undefined;
        }

        //* @debug
        if (debug) locallog.log('Two-factor correct token');

        // make result
        const userId = _id.toJSON();

        const [accessToken, accessTokenExpireAt] = localcrypto.createAccessToken({
            userId,
        });

        const [refreshToken, refreshTokenExpireAt] = localcrypto.createRefreshToken({
            userId,
        });

        const result: SignInReturn = {
            userId,
            accessToken,
            accessTokenExpireAt,
            refreshToken,
            refreshTokenExpireAt,
        };

        //* @debug
        if (debug) locallog.object(result);

        user.refreshTokenHashed = localcrypto.quickHash(refreshToken);

        //* @debug
        if (debug) locallog.log('refreshTokenHashed', user.refreshTokenHashed);

        await user.save();

        //* @debug
        if (debug)
            locallog.log(
                `updated refreshTokenHashed=${user.refreshTokenHashed} for user=${userId}`,
            );

        return result;
    } catch (e) {
        return undefined;
    }
};

// ===================== signOut =========================

const signOut = async (userId: string): Promise<boolean> => {
    const updateResult = await User.updateOne(
        {
            _id: new ObjectId(userId),
        },
        {
            $unset: {
                refreshTokenHashed: '',
            },
        },
    );

    return updateResult.modifiedCount === 1;
};

// ===================== signUp =========================

export type SignUpProps = Pick<UserSchema, 'username' | 'password' | 'twoFactorSecretKey'>;

const signUp = async (props: SignUpProps): Promise<UserDoc> => {
    console.log(props);

    return await User.create({
        ...props,
        password: localcrypto.hashPassword(props.password),
    });
};

// ===================== isUsernameExisted =========================

const isUsernameExisted = async (username: string) => {
    const user = await User.findOne({ username });
    return user != null;
};

// * register static methods for User;
const userStatic = Object.freeze({
    signIn,
    signOut,
    signUp,
    isUsernameExisted,
});

export type UserStatics = typeof userStatic;

export default userStatic;
