import Client, { ClientOptions } from "./client";
import Auth from "./realtime/auth";

export default class Realtime extends Client {

    public auth: Auth;

    constructor(options: ClientOptions) {
        super(options);

        this.auth = new Auth(options);
    }
}