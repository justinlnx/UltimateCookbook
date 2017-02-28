export class WebServiceException extends Error {
    constructor(m: string) {
        super(m);

        Object.setPrototypeOf(this, WebServiceException.prototype);
    }

    throwWebServiceException() {
        return this.message;
    }
}
