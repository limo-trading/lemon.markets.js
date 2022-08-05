import Client, { ClientOptions } from "../client"
import { convertDate, convertNumber, formatDate } from "../number_dates"
import { PageBuilder } from "../response_page"
import { OHLC, ResponsePage } from "../index"

type DataType = 'm1' | 'h1' | 'd1'

interface OHLCGetParams {
    x1: DataType
    isin: string | string[]
    mic?: string
    from?: Date
    to?: Date
    decimals?: boolean
}

export default class OHLCClient extends Client<OHLC> {

    constructor(options: ClientOptions) {
        super(options)
    }

    async get(options: OHLCGetParams) {
        return new Promise<ResponsePage<OHLC>>(async resolve => {
            if (typeof options.isin !== 'string') options.isin = options.isin.join(',')

            const decimals = options.decimals ?? true
            options.decimals = false

            const response = await this.httpClient.get(`/ohlc/${options.x1}`, {
                query: {
                    ...options,
                    from: options.from ? options.from.toISOString() : undefined,
                    to: options.to ? options.to.toISOString() : undefined,
                }
            })

            resolve(new PageBuilder<OHLC>(this.httpClient, this.cacheLayer)
                .build({
                    res: response,
                    useId: (data: OHLC) => { return `${data.isin}-${data.t}` },
                    override: (data: any) => ({
                        ...data,
                        o: convertNumber(data.o, decimals),
                        h: convertNumber(data.h, decimals),
                        l: convertNumber(data.l, decimals),
                        c: convertNumber(data.c, decimals),
                        pbv: convertNumber(data.pbv, decimals),
                        t: convertDate(data.t),
                    })
                }))
        })
    }

    public cache(options?: { decimals?: boolean }) {
        const decimals = options?.decimals ?? true
        return this.cacheLayer.getAll().map(data => ({
            ...data,
            o: convertNumber(data.o, decimals),
            h: convertNumber(data.h, decimals),
            l: convertNumber(data.l, decimals),
            c: convertNumber(data.c, decimals),
            pbv: convertNumber(data.pbv, decimals),
        }))
    }
}