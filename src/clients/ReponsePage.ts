export default interface ReponsePage<T> {
    page: number
    pages: number
    total: number
    previous: Function
    next: Function
    values: T[]
}