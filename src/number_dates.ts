export function convertNumber(i: number | string, decimals?: boolean): number {
    if(!i) return -1;
    if(typeof i === 'string') i = parseFloat(i);
    if(decimals) return Math.round((i + Number.EPSILON) * 100) / 1000000
    return i;
}

export function convertDate(date: string): Date {
    return new Date(date);
}