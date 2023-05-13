export function _partial(target: any) {
    const result: any = {};

    for (const key in target) {
        if (target[key] !== undefined) {
            result[key] = target[key];
        }
    }

    return result;
}