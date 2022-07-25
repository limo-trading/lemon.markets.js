export default interface ResponsePage<T> {
    page: number
    pages: number
    total: number
    previous: Function
    next: Function
    values: T[]
}