export default class LemonError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LemonError';
    }
}

const errorMessages = {
    'unauthorized': 'Unauthorized. The API key is not provided in the HTTP header, cannot be decoded by the backend, or the API Key does not exist.',
    'token_invalid': 'Token invalid. The API key is revoked or user is deleted/suspended.',
    'rate_limit_exceeded': 'Rate limit exceeded. The API key has exceeded its rate limit.',
    'not_found': 'Not found. The requested resource does not exist.',
    'internal_error': 'Internal error. An error occurred in the backend. This is not your fault. We will investigate this.',
}

export function handleApiError(error: any) {
    if(error.status !== 'error') return;
    switch(error.error_code) {
        case 'unauthorized': throw new LemonError(errorMessages.unauthorized);
        case 'token_invalid': throw new LemonError(errorMessages.token_invalid);
        case 'rate_limit_exceeded': throw new LemonError(errorMessages.rate_limit_exceeded);
        case 'internal_error': throw new LemonError(errorMessages.internal_error);
        default: {
            if(error.error_code.match(/\w_not_found/)) throw new LemonError(errorMessages.not_found);
            throw new LemonError(error.error_code + ': ' + error.error_message);
        }
    }
}