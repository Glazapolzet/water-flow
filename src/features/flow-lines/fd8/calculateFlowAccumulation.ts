import { directions } from './directions';

//реализация алгоритма fd8
export function calculateFlowAccumulation(
  elevationGrid: number[][],
  options: {
    threshold?: number; // Порог для "русла"
    exponent?: number;
  } = {},
): number[][] {
  const { threshold = Infinity, exponent = 1.1 } = options;

  const rows = elevationGrid.length;
  const columns = elevationGrid[0].length;

  // Инициализация сетки аккумуляции потока
  const flowAccumulationGrid: number[][] = new Array(rows).fill(null).map(() => new Array(columns).fill(1)); // Начальное значение 1 для каждой ячейки

  // Проход по всем ячейкам
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      distributeFlow(row, col, elevationGrid, flowAccumulationGrid, exponent, threshold);
    }
  }

  return flowAccumulationGrid;
}

function distributeFlow(
  row: number,
  col: number,
  elevationGrid: number[][],
  flowAccumulationGrid: number[][],
  exponent: number,
  threshold: number,
): void {
  const weights = calculateFlowWeights(row, col, elevationGrid, exponent);

  if (weights.length === 0) return; // Локальный минимум

  // Если аккумуляция потока превышает порог, направляем поток в одну ячейку
  if (flowAccumulationGrid[row][col] > threshold) {
    let maxWeight = 0;
    let maxDirection = { dx: 0, dy: 0 };

    for (const { dx, dy, weight } of weights) {
      if (weight > maxWeight) {
        maxWeight = weight;
        maxDirection = { dx, dy };
      }
    }

    const neighborRow = row + maxDirection.dy;
    const neighborCol = col + maxDirection.dx;
    flowAccumulationGrid[neighborRow][neighborCol] += flowAccumulationGrid[row][col];
  } else {
    // Распределяем поток по всем соседним ячейкам
    for (const { dx, dy, weight } of weights) {
      const neighborRow = row + dy;
      const neighborCol = col + dx;
      flowAccumulationGrid[neighborRow][neighborCol] += flowAccumulationGrid[row][col] * weight;
    }
  }
}

function calculateFlowWeights(
  row: number,
  col: number,
  elevationGrid: number[][],
  exponent: number,
): { dx: number; dy: number; weight: number }[] {
  const weights: { dx: number; dy: number; weight: number }[] = [];
  let totalWeight = 0;

  for (const { dx, dy } of directions) {
    const neighborRow = row + dy;
    const neighborCol = col + dx;

    // Проверка, что соседняя ячейка находится внутри сетки
    if (
      neighborRow >= 0 &&
      neighborRow < elevationGrid.length &&
      neighborCol >= 0 &&
      neighborCol < elevationGrid[0].length
    ) {
      const slope = (elevationGrid[row][col] - elevationGrid[neighborRow][neighborCol]) / Math.sqrt(dx * dx + dy * dy);
      if (slope > 0) {
        const weight = Math.pow(slope, exponent);
        weights.push({ dx, dy, weight });
        totalWeight += weight;
      }
    }
  }

  // Нормализация весов
  if (totalWeight > 0) {
    for (const weightData of weights) {
      weightData.weight /= totalWeight;
    }
  }

  return weights;
}
