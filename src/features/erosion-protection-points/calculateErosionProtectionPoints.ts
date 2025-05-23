import { FeatureCollection, LineString, Position } from 'geojson';

interface SlopeParameters {
  a: number;
  b: number;
}

interface ErosionParameters {
  alpha: number;
  kT: number;
  kM: number;
  kE: number;
  h: number;
  wThreshold: number;
  lV: number;
  lP: number;
}

interface ProtectionPoint {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: Position;
  };
  properties: {
    elevation: number;
    distanceFromStart: number;
  };
}

export function calculateErosionProtectionPoints(
  flowLines: FeatureCollection<LineString>,
  slopeParams: SlopeParameters,
  erosionParams: ErosionParameters,
  step = 10,
): ProtectionPoint[] {
  const { a, b } = slopeParams;
  const { alpha, kT, kM, kE, h, wThreshold, lV, lP } = erosionParams;

  const protectionPoints: ProtectionPoint[] = [];

  // Обрабатываем каждую линию тока
  for (const feature of flowLines.features) {
    const coordinates = feature.geometry.coordinates;
    if (coordinates.length < 2) continue;

    // Начальные параметры для линии тока
    let hMax = coordinates[0][2]; // Начальная высота (Z-координата)
    const hMin = coordinates[coordinates.length - 1][2]; // Минимальная высота
    let lPrev = 0;
    let hPrev = hMax;
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
      const deltaH = hMax - hMin;
      const c = Math.exp(a);
      const phi = Math.exp(-b * accumulatedDistance);
      const phi1 = (b * c * phi) / deltaH;
      const P = deltaH / (1 + c * phi);

      // Расчет текущего смыва
      const wCurrent =
        alpha * kT * kM * kE * Math.pow(h, 0.95) * accumulatedDistance * Math.pow(phi1 * Math.pow(P, 2), 1.5);

      if (wCurrent > wThreshold) {
        // Расчет средней крутизны склона между текущей и предыдущей точкой
        const slopeAngle = Math.atan((hPrev - currentH) / (accumulatedDistance - lPrev));

        // Расчет L_ci
        const lCi = lP * (1 - 3 * Math.tan(slopeAngle));

        // Расчет L_mp
        let lMp = accumulatedDistance + lV;

        if (lMp <= lCi && lMp < lP) {
          lMp = lCi;
        } else if (lMp > lCi && lMp >= lP) {
          lMp = lP;
        }

        // Если достигли максимального расстояния без превышения порога
        if (lP === 400 && wCurrent <= wThreshold) {
          lMp = 400;
        }

        // Добавление точки в результат
        protectionPoints.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              prevCoord[0] + (currentCoord[0] - prevCoord[0]) * (step / segmentLength),
              prevCoord[1] + (currentCoord[1] - prevCoord[1]) * (step / segmentLength),
              currentH,
            ],
          },
          properties: {
            elevation: currentH,
            distanceFromStart: accumulatedDistance,
          },
        });

        // Обновление параметров для следующей итерации
        hMax = currentH;
        lPrev = accumulatedDistance;
        hPrev = currentH;
      }
    }
  }

  return protectionPoints;
}
