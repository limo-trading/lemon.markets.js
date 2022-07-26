import HttpClient from "./http_client"
import Cache from "./cache"

export default interface ResponsePage<T> {
    page: number
    pages: number
    total: number
    previous: Function
    next: Function
    values: T[]
}

export class PageBuilder<T> {

    private http_client: HttpClient
    private cache_layer?: Cache<T>

    constructor(http_client: HttpClient, cache_layer?: Cache<T>) {
        this.http_client = http_client;
        this.cache_layer = cache_layer;
    }

    public build(res: any, use_id?: string): ResponsePage<T> {
        // cache
        if(this.cache_layer) {
            // @ts-ignore
            res.results.forEach(element => {
                this.cache_layer!.set(use_id ? element[use_id] : element.id, element);
            });
        }
        
        return {
            page: res.page,
            pages: res.pages,
            total: res.total,
            previous: () => {
                if(res.previous) {
                    return new Promise<ResponsePage<T>>(async resolve => {
                        const external_res = await this.http_client.external_fetch(res.previous)
                        resolve(new PageBuilder<T>(this.http_client, this.cache_layer).build(external_res, use_id));
                    })
                }
            },
            next: () => {
                if(res.next) {
                    return new Promise<ResponsePage<T>>(async resolve => {
                        const external_res = await this.http_client.external_fetch(res.next)
                        resolve(new PageBuilder<T>(this.http_client, this.cache_layer).build(external_res, use_id));
                    })
                }
            },
            values: res.results,
        }
    }
}