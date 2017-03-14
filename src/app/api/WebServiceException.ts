export class WebServiceException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, WebServiceException.prototype);
  }

  public throwWebServiceException() {
    return this.message;
  }
}
