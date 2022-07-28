export function convertNumber(number: number | string, decimals?: boolean): number {
    if(!number) return -1;
    if(typeof number === 'string') number = parseFloat(number);
    if(decimals) return Math.round((number + Number.EPSILON) * 100) / 1000000
    return number;
}

export function convertDate(date: string): Date {
    return new Date(date);
}