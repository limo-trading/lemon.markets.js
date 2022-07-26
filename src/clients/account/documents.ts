import Client, { ClientOptions } from "../../client";
import ResponsePage, { toResponsePage } from "../../response_page";

interface DocumentsGetResponse {
    id: string
    name: string
    created_at: string
    category: string
    link: string
    viewed_first_at: string
    viewed_last_at: string
}

export class Documents extends Client {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get() {
        return new Promise<ResponsePage<DocumentsGetResponse>>(async resolve => {
            const response = await this.http_client.get('/account/documents');
            resolve(toResponsePage(response, this.http_client));
        });
    }
}