import { Feature, FeatureCollection, LineString, Position } from 'geojson';
import { directions } from './directions';

// Типы для ясности
type FlowGrid = number[][];
type ElevationGrid = number[][];
type CoordinatesGrid = Position[][]; // [x, y] на каждой позиции
type FlowDirection = { dx: number; dy: number } | null;

/**
 * Преобразует сетку аккумуляции в линии стока (GeoJSON)
 */
export function transformFlowAccumulationToFlowLines(
  elevationGrid: ElevationGrid,
  coordinatesGrid: CoordinatesGrid,
  flowGrid: FlowGrid,
  options: {
    threshold?: number; // Порог для "русла" (default: 5% от max)
    minLength?: number; // Минимальная длина линии (ячейки)
  } = {},
): FeatureCollection<LineString> {
  const maxFlow = Math.max(...flowGrid.flat());

  const { threshold = maxFlow * 0.05, minLength = 3 } = options;

  const rows = flowGrid.length;
  const cols = flowGrid[0].length;

  // Находим стартовые точки (ячейки с высокой аккумуляцией)
  const startPoints: [number, number][] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (flowGrid[y][x] >= threshold) {
        startPoints.push([y, x]);
      }
    }
  }

  // Строим линии от каждой точки
  const features = startPoints
    .map(([y, x]) => {
      const line = traceFlowLine(y, x, elevationGrid, coordinatesGrid);
      return lineToFeature(line);
    })
    .filter((f) => f.geometry.coordinates.length >= minLength);

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Трассирует одну линию стока
 */
function traceFlowLine(
  startY: number,
  startX: number,
  elevationGrid: ElevationGrid,
  coordinatesGrid: CoordinatesGrid,
): Position[] {
  const line: Position[] = [];
  let [y, x] = [startY, startX];
  const visited = new Set<string>();

  while (true) {
    // Получаем реальные координаты из координатной сетки
    const [wx, wy] = coordinatesGrid[y][x];
    line.push([wx, wy]);

    // Проверяем, не зациклились ли мы
    const cellKey = `${y},${x}`;
    if (visited.has(cellKey)) break;
    visited.add(cellKey);

    // Получаем направление потока
    const direction = getFlowDirection(y, x, elevationGrid, coordinatesGrid);
    if (!direction) break; // Локальный минимум

    // Переходим к следующей ячейке
    y += direction.dy;
    x += direction.dx;

    // Проверка границ
    if (y < 0 || y >= elevationGrid.length || x < 0 || x >= elevationGrid[0].length) break;
  }

  return line;
}

/**
 * Определяет направление стока для ячейки (FD8)
 */
function getFlowDirection(
  y: number,
  x: number,
  elevationGrid: ElevationGrid,
  coordinatesGrid: CoordinatesGrid,
): FlowDirection {
  let maxSlope = 0;
  let bestDir: FlowDirection = null;

  for (const dir of directions) {
    const ny = y + dir.dy;
    const nx = x + dir.dx;

    if (ny >= 0 && ny < elevationGrid.length && nx >= 0 && nx < elevationGrid[0].length) {
      // Рассчитываем реальное расстояние между точками
      const [x1, y1] = coordinatesGrid[y][x];
      const [x2, y2] = coordinatesGrid[ny][nx];
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

      if (distance > 0) {
        const slope = (elevationGrid[y][x] - elevationGrid[ny][nx]) / distance;

        if (slope > maxSlope) {
          maxSlope = slope;
          bestDir = dir;
        }
      }
    }
  }

  return bestDir;
}

/**
 * Преобразует массив координат в GeoJSON Feature
 */
function lineToFeature(coords: Position[]): Feature<LineString> {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: coords,
    },
  };
}
