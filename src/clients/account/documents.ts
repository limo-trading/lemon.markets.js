import Client, { ClientOptions } from "../../client";
import { PageBuilder } from "../../response_page";
import { Document, ResponsePage } from "../../types";

export default class DocumentsClient extends Client<Document> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get() {
        return new Promise<ResponsePage<Document>>(async resolve => {
            const response = await this.httpClient.get('/account/documents');
            resolve(new PageBuilder<Document>(this.httpClient, this.cacheLayer).build(response));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}