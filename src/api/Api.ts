type TResponseSuccess<S> = S;
type TResponseError<E> = E;

type JSONResponse<S, E> = TResponseSuccess<S> | TResponseError<E>;

export class Api {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string, headers: HeadersInit) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async fetch<S, E>(endpoint: string, { headers = {}, ...options }: RequestInit = {}): Promise<S | E> {
    const res: Response = await fetch(this.baseUrl + endpoint, {
      headers: Object.assign(headers, this.headers),
      ...options,
    });

    if (!res.ok) {
      return Promise.reject(new Error(res.statusText));
    }

    return (await res.json()) as JSONResponse<S, E>;
  }
}
