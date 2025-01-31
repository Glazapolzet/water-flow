import { toLonLat } from 'ol/proj';

export const transformXYToLonLat = (coords: number[][]): { lon: number; lat: number }[] => {
  const lonLatList = [];

  for (let i = 0; i < coords.length; i++) {
    const [lon, lat] = toLonLat(coords[i]);

    lonLatList.push({ lon, lat });
  }

  return lonLatList;
};
