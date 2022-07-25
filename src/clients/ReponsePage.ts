export default interface ReponsePage<T> {
    mode: 'paper' | 'live';
    page: number
    pages: number
    total: number
    previous: Function
    next: Function
    values: T[]
}