export const isEmpty = (obj: NonNullable<unknown> | string | null | undefined) => {
    return !obj || obj === "";
}

export const getUserInitials = (artistName: string) => {
    if (!artistName) return "?";
    const parts = artistName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}