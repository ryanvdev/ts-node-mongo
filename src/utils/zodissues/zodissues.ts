import { ZodIssue } from 'zod';

export function toIssuesTypeOne(issues: ZodIssue[]) {
    const result: IndexSignature<string[]> = {};

    issues.forEach(({ path: issuePath, message }) => {
        const strPath = issuePath.length > 0 ? issuePath.join('.') : '_root';

        if (strPath in result) {
            result[strPath].push(message);
        } else {
            result[strPath] = [message];
        }
    });

    return result;
}
