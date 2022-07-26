import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";
import { Document } from "../../types";

export default class DocumentsClient extends Client<Document> {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get() {
        return new Promise<ResponsePage<Document>>(async resolve => {
            const response = await this.http_client.get('/account/documents');
            resolve(new PageBuilder<Document>(this.http_client, this.cache_layer).build(response));
        });
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}