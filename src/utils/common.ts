type TParameter = { key: string, value: string }[]

export const arraysEqual = (array1: TParameter, array2: TParameter) => {
    if (array1?.length !== array2?.length) {
        return true;
    }

    for (let i = 0; i < array1?.length; i++) {
        if (array1?.[i]?.['key'] !== array2?.[i]?.['key']) {
            return true;
        }
    }
    return false;
};
