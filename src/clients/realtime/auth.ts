import Client, { ClientOptions } from "../client";

interface AuthCreateResponse {
    token: string
    expires_at: string
    user_id: string
}

export default class Auth extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }

    public create() {
        return new Promise<AuthCreateResponse>(async resolve => {
            const response = await this.http_client.post('/auth');
            resolve(response);
        });
    }
}