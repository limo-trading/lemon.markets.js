import Client, { ClientOptions } from "../client";

// Cache layer is required to make realtime possible.

interface RealtimeSubscribeRequest {
    isin: string | string[];
}

export default class Realtime extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }

    public subscribe(options: RealtimeSubscribeRequest) {
        
    }
}