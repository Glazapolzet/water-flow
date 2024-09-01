import { apiInstance } from './base';
import { TElevation, TElevationResponse } from './types';

export async function getElevation(data: TElevation): Promise<TElevationResponse> {
  return apiInstance.fetch('/height', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
