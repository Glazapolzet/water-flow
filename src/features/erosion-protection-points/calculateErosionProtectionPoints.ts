import { featureCollection } from '@turf/helpers';
import { Feature, FeatureCollection, LineString, Point } from 'geojson';

interface SlopeParameters {
  a: number;
  b: number;
}

interface ErosionParameters {
  alpha: number;
  Kt: number;
  Km: number;
  Ke: number;
  h: number;
  WLimit: number;
  Lv: number;
  Lp: number;
}

type ProtectionPointProps = {
  [key: string]: number;
  distanceFromStart: number;
};

export function calculateErosionProtectionPoints(
  flowLines: FeatureCollection<LineString>,
  slopeParams: SlopeParameters,
  erosionParams: ErosionParameters,
  options?: { zProperty?: string; step?: number },
): FeatureCollection<Point, ProtectionPointProps> {
  const { a, b } = slopeParams;
  const { alpha, Kt, Km, Ke, h, WLimit, Lv, Lp } = erosionParams;
  const { zProperty = 'zValue', step = 10 } = options ?? {};

  const protectionPoints: Feature<Point, ProtectionPointProps>[] = [];

  // Обрабатываем каждую линию тока
  for (const feature of flowLines.features) {
    const coordinates = feature.geometry.coordinates;
    if (coordinates.length < 2) continue;

    // Начальные параметры для линии тока
    let Hmax = coordinates[0][2]; // Начальная высота (Z-координата)
    const Hmin = coordinates[coordinates.length - 1][2]; // Минимальная высота
    let lPrev = 0;
    let hPrev = Hmax;
    let accumulatedDistance = 0;

    // Проходим по всем точкам линии тока
    for (let i = 1; i < coordinates.length; i++) {
      const prevCoord = coordinates[i - 1];
      const currentCoord = coordinates[i];

      // Рассчитываем расстояние между текущей и предыдущей точкой
      const segmentLength = Math.sqrt(
        Math.pow(currentCoord[0] - prevCoord[0], 2) + Math.pow(currentCoord[1] - prevCoord[1], 2),
      );

      accumulatedDistance += segmentLength;

      // Пропускаем точки, если не достигли шага
      if (accumulatedDistance < step && i !== coordinates.length - 1) {
        continue;
      }

      // Высота текущей точки (линейная интерполяция для точности)
      const currentH = prevCoord[2] + (currentCoord[2] - prevCoord[2]) * (step / segmentLength);

      // Расчет параметров для текущей точки
      const deltaH = Hmax - Hmin;
      const c = Math.exp(a);
      const phi = Math.exp(-b * accumulatedDistance);
      const phi1 = (b * c * phi) / deltaH;
      const P = deltaH / (1 + c * phi);

      // Расчет текущего смыва
      const Wcurrent =
        alpha * Kt * Km * Ke * Math.pow(h, 0.95) * accumulatedDistance * Math.pow(phi1 * Math.pow(P, 2), 1.5);

      if (Wcurrent > WLimit) {
        // Расчет средней крутизны склона между текущей и предыдущей точкой
        const slopeAngle = Math.atan((hPrev - currentH) / (accumulatedDistance - lPrev));

        // Расчет L_ci
        const Lci = Lp * (1 - 3 * Math.tan(slopeAngle));

        // Расчет L_mp
        let Lmp = accumulatedDistance + Lv;

        if (Lmp <= Lci && Lmp < Lp) {
          Lmp = Lci;
        } else if (Lmp > Lci && Lmp >= Lp) {
          Lmp = Lp;
        }

        // Если достигли максимального расстояния без превышения порога
        if (Lp === 400 && Wcurrent <= WLimit) {
          Lmp = 400;
        }

        // Добавление точки в результат
        protectionPoints.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              prevCoord[0] + (currentCoord[0] - prevCoord[0]) * (step / segmentLength),
              prevCoord[1] + (currentCoord[1] - prevCoord[1]) * (step / segmentLength),
            ],
          },
          properties: {
            [zProperty]: currentH,
            distanceFromStart: accumulatedDistance,
          },
        });

        // Обновление параметров для следующей итерации
        Hmax = currentH;
        lPrev = accumulatedDistance;
        hPrev = currentH;
      }
    }
  }

  return featureCollection(protectionPoints);
}
