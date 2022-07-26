import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";
import { Document } from "../../types";

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