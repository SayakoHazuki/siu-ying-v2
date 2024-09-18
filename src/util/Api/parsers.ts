export function parseApiCalendarDate(date: string): Date {
    // "01/09/2024"
    const [day, month, year] = date.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
}
