import { ValhallaApi } from './ValhallaApi';

const API_BASE_URL = 'https://valhalla1.openstreetmap.de';

const headers = {
  'Content-Type': 'application/json',
};

export const apiInstance = new ValhallaApi(API_BASE_URL, headers);
