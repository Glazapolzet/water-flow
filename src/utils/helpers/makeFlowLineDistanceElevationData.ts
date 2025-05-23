import { Feature, GeoJsonProperties, LineString } from 'geojson';

export const makeFlowLineDistanceElevationData = (feature: Feature<LineString, GeoJsonProperties>) => {
  // Проверяем, что есть хотя бы одна линия
  if (!feature || feature.geometry.coordinates.length === 0) {
    return { distances: [], elevations: [] };
  }

  // Берем первую линию из коллекции (предполагаем, что она одна)
  const coordinates = feature.geometry.coordinates;

  const distances = [0]; // Первая точка - расстояние 0
  const elevations = [coordinates[0][2]];

  // Если только одна точка, возвращаем массивы с одним элементом
  if (coordinates.length === 1) {
    return { distances, elevations };
  }

  // Проходим по всем точкам, начиная со второй
  for (let i = 1; i < coordinates.length; i++) {
    const prevCoord = coordinates[i - 1];
    const currCoord = coordinates[i];

    // 1. Рассчитываем расстояние между текущей и предыдущей точкой
    const dx = currCoord[0] - prevCoord[0];
    const dy = currCoord[1] - prevCoord[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 2. Добавляем к предыдущему расстоянию
    const totalDistance = distances[i - 1] + distance;

    // 3. Записываем расстояние и высоту
    distances.push(totalDistance);
    elevations.push(currCoord[2]);
  }

  return { distances, elevations };
};
