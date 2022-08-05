import Client, { ClientOptions } from "../../client";
import { convertDate } from "../../number_dates";
import { PageBuilder } from "../../response_page";
import { Document, ResponsePage } from "../../index";

export default class DocumentsClient extends Client<Document> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get() {
        return new Promise<ResponsePage<Document>>(async resolve => {
            const response = await this.httpClient.get('/account/documents');
            resolve(new PageBuilder<Document>(this.httpClient, this.cacheLayer)
            .build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    created_at: convertDate(data.created_at),
                    viewed_first_at: convertDate(data.viewed_first_at),
                    viewed_last_at: convertDate(data.viewed_last_at),
                })
            }));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}