import { User } from '../database/User/User';
import locallog from '../utils/locallog';

export default async function loadRootAccount() {
    try {
        // Exited root account
        if (await User.isUsernameExisted(__env.ACCOUNT_ROOT_USERNAME)) {
            return;
        }

        const { ACCOUNT_ROOT_USERNAME, ACCOUNT_ROOT_PASSWORD, ACCOUNT_ROOT_TWO_FACTOR_SECRET } =
            __env;

        // Sign up new root account
        const newRootAccount = await User.signUp({
            username: ACCOUNT_ROOT_USERNAME,
            password: ACCOUNT_ROOT_PASSWORD,
            twoFactorSecretKey: ACCOUNT_ROOT_TWO_FACTOR_SECRET || '',
        });

        locallog.object(newRootAccount.toJSON());
    } catch (e) {
        throw e;
    }
}
