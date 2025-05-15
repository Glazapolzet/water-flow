interface OptimizationResult {
  a: number;
  b: number;
  hMax: number;
  hMin: number;
  error: number;
}

export const optimizeLogisticFunction = (
  L_values: number[],
  H_values: number[],
  initialHMax?: number,
  initialHMin?: number,
  deltaH = 10,
  minDeltaH = 0.1,
): OptimizationResult => {
  // Инициализация параметров
  const I2 = 0; // Индекс начальной точки для оптимизации
  const N2 = H_values.length - 1; // Индекс конечной точки для оптимизации

  // Определение Hmax и Hmin
  const Hmax = initialHMax ?? Math.max(...H_values);
  const Hmin = initialHMin ?? Math.min(...H_values);

  let Pot = Hmax; // Потолок (начальное приближение)
  let Pol = Hmin; // Пол (начальное приближение)

  // Вспомогательные переменные
  let A = 0,
    B = 0;
  let bestA = 0,
    bestB = 0;
  let bestPot = Pot,
    bestPol = Pol;
  let minError = Infinity;
  let iterationCount = 0;
  const maxIterations = 1000;

  // Основной цикл оптимизации
  while (deltaH >= minDeltaH && iterationCount < maxIterations) {
    iterationCount++;

    // Шаг 1: Преобразование данных
    const transformedY: number[] = [];
    for (let i = I2; i <= N2; i++) {
      const L1 = Pot - H_values[i];
      const L2 = H_values[i] - Pol;

      if (L1 > 0 && L2 > 0) {
        transformedY.push(Math.log(L1 / L2));
      }
    }

    // Шаг 2: Линейная регрессия (подбор A и B)
    if (transformedY.length > 0) {
      const n = transformedY.length;
      let Sx = 0,
        Sy = 0,
        Sxy = 0,
        Sxx = 0;

      for (let i = I2; i <= I2 + transformedY.length - 1; i++) {
        const x = L_values[i];
        const y = transformedY[i - I2];

        Sx += x;
        Sy += y;
        Sxy += x * y;
        Sxx += x * x;
      }

      B = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx);
      A = (-Sy + B * Sx) / n;

      // Шаг 3: Расчет ошибки
      let error = 0;
      for (let i = I2; i <= N2; i++) {
        const predicted = (Pot - Pol) / (1 + Math.exp(-A + B * L_values[i])) + Pol;
        error += Math.pow(predicted - H_values[i], 2);
      }
      error = Math.sqrt(error / (n - 2));

      // Шаг 4: Обновление лучших параметров
      if (error < minError) {
        minError = error;
        bestA = A;
        bestB = B;
        bestPot = Pot;
        bestPol = Pol;

        // Уменьшаем шаг для более точной подгонки
        deltaH *= 0.5;
      } else {
        // Если ошибка увеличилась, меняем направление
        Pot += deltaH;
        Pol += deltaH;
      }
    } else {
      // Если преобразование не удалось, корректируем Pot и Pol
      Pot -= deltaH;
      Pol += deltaH;
    }
  }

  return {
    a: bestA,
    b: bestB,
    hMax: bestPot,
    hMin: bestPol,
    error: minError,
  };
};
