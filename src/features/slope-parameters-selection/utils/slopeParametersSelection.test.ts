import { expect, test } from 'vitest';
import { slopeParametersSelection } from './slopeParametersSelection';

test('should find correct parameters for known logistic curve', () => {
  // Создаем данные по известной логистической кривой
  const knownA = 2;
  const knownB = 0.5;
  const H_min = 100;
  const H_max = 200;

  const logisticFunc = (L: number) => (H_max - H_min) / (1 + Math.exp(-knownA + knownB * L)) + H_min;

  const L_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const H_values = L_values.map(logisticFunc);

  console.log(L_values, H_values);

  const { a, b, hMax, hMin, error } = slopeParametersSelection(L_values, H_values, H_max, H_min);

  console.log({ a, b, hMax, hMin, error });

  // Проверяем с некоторой погрешностью
  expect(a).toBeCloseTo(knownA, 1);
  expect(b).toBeCloseTo(knownB, 1);
});
