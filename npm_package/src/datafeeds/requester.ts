import {
  RequestParams,
  UdfResponse,
  UdfErrorResponse,
  logMessage
} from "./helpers";

export class Requester {
  private _headers: HeadersInit | undefined;
  public options: { [key: string]: (params: any) => Promise<any> } = {};

  public constructor(options: any, headers?: HeadersInit) {
    if (headers) {
      this._headers = headers;
    }
    this.options = options;
  }

  public sendRequest<T extends UdfResponse>(
    datafeedUrl: string,
    urlPath: string,
    params?: RequestParams
  ): Promise<T | UdfErrorResponse>;
  public sendRequest<T>(
    datafeedUrl: string,
    urlPath: string,
    params?: RequestParams
  ): Promise<T>;
  public sendRequest<T>(
    datafeedUrl: string,
    urlPath: string,
    params?: RequestParams
  ): Promise<T> {
    if (this.options[urlPath]) {
      return this.options[urlPath](params).then(res => res);
    }
    if (params !== undefined) {
      const paramKeys = Object.keys(params);
      if (paramKeys.length !== 0) {
        urlPath += "?";
      }

      urlPath += paramKeys
        .map((key: string) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key].toString()
          )}`;
        })
        .join("&");
    }

    logMessage("New request: " + urlPath);

    // Send user cookies if the URL is on the same origin as the calling script.
    const options: RequestInit = { credentials: "same-origin" };

    if (this._headers !== undefined) {
      options.headers = this._headers;
    }

    return fetch(`${datafeedUrl}/${urlPath}`, options)
      .then((response: Response) => response.text())
      .then((responseTest: string) => JSON.parse(responseTest));
  }
}
