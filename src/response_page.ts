import HttpClient from "./http_client"
import Cache from "./cache"
import { Quote, ResponsePage } from "./index";

export class PageBuilder<T> {

    private httpClient: HttpClient
    private cacheLayer?: Cache<T>

    constructor(httpClient: HttpClient, cacheLayer?: Cache<T>) {
        this.httpClient = httpClient;
        this.cacheLayer = cacheLayer;
    }

    public build(options: { res: any, useId?: string | ((data: T) => string), override?: (data: any) => T }): ResponsePage<T> {

        const { res, useId, override } = options;

        const values: T[] = override ? res.results.map((value: any) => override(value)) : res.results;

        // cache
        if (this.cacheLayer) {
            // get current node version
            const version = parseInt(process.version.split('.')[0].substring(1))
            if(version < 17) {
                console.warn('\x1b[33m[lemon.markets.js] Node.js versions below v17 are deprecated. Some functions are not supported. Consider upgrading.\x1b[0m')
            }
            // copy values. if node version is >= 16, use structuredClone
            const valuesCopy = version >= 17 ? structuredClone(values) : JSON.parse(JSON.stringify(values))
            // @ts-ignore
            valuesCopy.forEach((element, index) => {
                Object.keys(element).forEach(key => {
                    // @ts-ignore
                    if(typeof element[key] === 'number') {
                        // @ts-ignore
                        element[key] = res.results[index][key];
                    }
                })
                if (useId && typeof useId !== 'string') {
                    this.cacheLayer!.set(useId(element), element);
                } else {
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
            values
        }
    }
}