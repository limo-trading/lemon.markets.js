import HttpClient from "../http_client"

export default interface ResponsePage<T> {
    page: number
    pages: number
    total: number
    previous: Function
    next: Function
    values: T[]
}

export function toResponsePage(res: any, http_client: HttpClient) {
    return {
        page: res.page,
        pages: res.pages,
        total: res.total,
        previous: () => {
            if(res.previous) http_client.external_fetch(res.previous);
        },
        next: () => {
            if(res.next) http_client.external_fetch(res.next);
        },
        values: res.values,
    }
}