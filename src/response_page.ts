import HttpClient from "./http_client"
import Cache from "./cache"
import { Quote, ResponsePage } from "./types";

export class PageBuilder<T> {

    private httpClient: HttpClient
    private cacheLayer?: Cache<T>

    constructor(httpClient: HttpClient, cacheLayer?: Cache<T>) {
        this.httpClient = httpClient;
        this.cacheLayer = cacheLayer;
    }

    public build(options: {res: any, useId?: string | ((data: T) => string), override?: (data: any) => T}): ResponsePage<T> {
        
        const { res, useId, override } = options;

        const values: T[] = override ? res.results.map((value: any) => override(value)) : res.results;
        
        // cache
        if (this.cacheLayer) {
            // @ts-ignore
            values.forEach(element => {
                if(useId && typeof useId !== 'string') {
                    this.cacheLayer!.set(useId(element), element);
                }else {
                    // @ts-ignore
                    this.cacheLayer!.set(useId ? element[useId] : element.id, element);
                }
            });
        }

        return {
            page: res.page,
            pages: res.pages,
            total: res.total,
            previous: () => {
                if (res.previous) {
                    return new Promise<ResponsePage<T>>(async resolve => {
                        const externalRes = await this.httpClient.external_fetch(res.previous)
                        resolve(new PageBuilder<T>(this.httpClient, this.cacheLayer).build({
                            res: externalRes,
                            useId,
                            override
                        }))
                    })
                }
                throw new Error('No previous page')
            },
            next: () => {
                if (res.next) {
                    return new Promise<ResponsePage<T>>(async resolve => {
                        const externalRes = await this.httpClient.external_fetch(res.next)
                        resolve(new PageBuilder<T>(this.httpClient, this.cacheLayer).build({
                            res: externalRes,
                            useId,
                            override
                        }));
                    })
                }
                throw new Error('No next page')
            },
            values: values,
        }
    }
}