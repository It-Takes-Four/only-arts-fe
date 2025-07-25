export const isEmpty = (obj: NonNullable<unknown> | string | null | undefined) => {
    return !obj || obj === "";
}

