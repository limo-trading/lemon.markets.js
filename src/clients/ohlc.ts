import Client, { ClientOptions } from "../client"
import ResponsePage, { PageBuilder } from "../response_page"

type DataType = 'm1' | 'h1' | 'd1'

interface OHLCGetRequest {
    x1: DataType
    isin: string | string[10]
    mic: string
    from: string
    to: string
    decimals: boolean
    epoch: boolean
}

interface OHLCGetResponse {
    isin: string
    o: number
    h: number
    l: number
    c: number
    v: number
    pbv: number
    t: string
    mic: string
}

export default class OHLC extends Client<OHLCGetResponse> {

    constructor(options: ClientOptions) {
        super(options)
    }

    async get(options: OHLCGetRequest) {
        return new Promise<ResponsePage<OHLCGetResponse>>(async resolve => {
            const response = await this.httpClient.get(`/ohlc/${options.x1}`, { query: options })
            resolve(new PageBuilder<OHLCGetResponse>(this.httpClient, this.cacheLayer).build(response))
        })
    }

    async cache() {
        return this.cacheLayer.getAll()
    }
}