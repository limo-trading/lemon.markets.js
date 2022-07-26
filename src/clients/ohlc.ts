import Client, { ClientOptions } from "../client"
import ResponsePage, { PageBuilder } from "../response_page"
import { OHLC } from "../types"

type DataType = 'm1' | 'h1' | 'd1'

interface OHLCGetRequest {
    x1: DataType
    isin: string | string[]
    mic?: string
    from?: string
    to?: string
    decimals?: boolean
    epoch?: boolean
}

export default class OHLCClient extends Client<OHLC> {

    constructor(options: ClientOptions) {
        super(options)
    }

    async get(options: OHLCGetRequest) {
        return new Promise<ResponsePage<OHLC>>(async resolve => {
            if (typeof options.isin !== 'string') options.isin = options.isin.join(',')
            const response = await this.httpClient.get(`/ohlc/${options.x1}`, { query: options })
            resolve(new PageBuilder<OHLC>(this.httpClient, this.cacheLayer).build(response, (data: OHLC) => {return `${data.isin}-${data.t}`}))
        })
    }

    public cache() {
        return this.cacheLayer.getAll()
    }
}