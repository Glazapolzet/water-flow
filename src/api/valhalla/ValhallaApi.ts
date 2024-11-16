import { Api } from '../Api';
import { TElevationError } from './types';

const isResponseError = <S, E extends TElevationError>(res: S | E): res is E => {
  return (res as E).error_code !== undefined;
};

export class ValhallaApi extends Api {
  constructor(baseUrl: string, headers: HeadersInit) {
    super(baseUrl, headers);
  }

  async fetch<S>(endpoint: string, { headers, ...options }: RequestInit): Promise<S> {
    const awaited = await super.fetch<S, TElevationError>(endpoint, { headers, ...options });

    if (isResponseError<S, TElevationError>(awaited)) {
      return Promise.reject(new Error(awaited.error));
    }

    const data = awaited;

    if (!data) {
      return Promise.reject(new Error('No data recieved'));
    }

    return data;
  }
}
