export function convertNumber(i: number | string, decimals?: boolean): number {
    if (!i) return -1;
    if (typeof i === 'string') i = parseFloat(i);
    if (decimals) return Math.round((i + Number.EPSILON) * 100) / 1000000
    return i;
}

export function convertDate(date: string): Date {
    return new Date(date);
}

export function formatDate(date: Date): string {
    const offset = date.getTimezoneOffset()
    const d = new Date(date.getTime() - offset * 60 * 1000);
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}