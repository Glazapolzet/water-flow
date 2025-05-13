import { expect, test } from 'vitest';
import { calculateFlowAccumulation } from './calculateFlowAccumulation';

test('simple flow accumulation', () => {
  const elevationGrid = [
    [5, 3, 2],
    [4, 2, 1],
    [3, 1, 0],
  ];

  const result = calculateFlowAccumulation(elevationGrid, { threshold: Infinity, exponent: 1.1 });

  expect(result).toEqual([
    [1, 2, 3],
    [1, 2, 4],
    [1, 2, 7],
  ]);
});
