import { expect, test } from 'vitest';
import { slopeParametersSelection } from './slopeParametersSelection';

test('should find correct parameters for known logistic curve', () => {
  // Создаем данные по известной логистической кривой
  const H_max = 20;
  const H_min = 10;
  const knownA = 2;
  const knownB = 0.5;

  const logisticFunc = (L: number) => (H_max - H_min) / (1 + Math.exp(-knownA + knownB * L)) + H_min;

  const L_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const H_values = L_values.map(logisticFunc);

  console.table(
    L_values.map((L) => ({
      Li: L,
    })),
  );
  console.table(
    H_values.map((H) => ({
      Hi: H,
    })),
  );

  const { a, b, hMax, hMin, error } = slopeParametersSelection(L_values, H_values, H_max, H_min);

  console.log(
    '\nрезультат подбора параметров: \n a: %d,\n b: %d,\n hMax: %d,\n hMin: %d,\n error: %d',
    a,
    b,
    hMax,
    hMin,
    error,
  );

  // Проверяем с некоторой погрешностью
  expect(a).toBeCloseTo(knownA, 1);
  expect(b).toBeCloseTo(knownB, 1);
});

test('should find correct parameters for real logistic curve', () => {
  // Создаем данные по известной логистической кривой
  const knownA = 2;
  const knownB = 0.5;

  const L_values = [
    0, 16.6109236786142, 33.2218473572284, 49.83277103630826, 66.44369471538812, 83.05461839446798, 99.66554207354784,
    116.27646575169638, 132.88738943077624, 149.4983131098561,
  ];

  const H_values = [194, 193, 191, 189, 187, 185, 183, 181, 179, 178];

  console.log(L_values, H_values);

  const { a, b, hMax, hMin, error } = slopeParametersSelection(L_values, H_values, 194, 178);

  console.log({ a, b, hMax, hMin, error });

  // Проверяем с некоторой погрешностью
  expect(a).toBeCloseTo(knownA, 1);
  expect(b).toBeCloseTo(knownB, 1);
});
