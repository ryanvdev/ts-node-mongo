export function toIntNil(value: unknown | any): number | undefined {
    if (value == null) return undefined;
    return parseInt(value);
}

export function stringBoolToBoolNil(value: unknown | any): boolean | undefined {
    if (typeof value !== 'string') return undefined;

    if (value === 'true') return true;
    if (value === 'false') return false;

    return undefined;
}
