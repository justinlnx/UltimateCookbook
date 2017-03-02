export class WebServiceException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, WebServiceException.prototype);
    }

    throwWebServiceException() {
        return this.message;
    }
}
