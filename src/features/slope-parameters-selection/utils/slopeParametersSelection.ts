import { levenbergMarquardt } from 'ml-levenberg-marquardt';

const createLogisticFunction = (H_min: number, H_max: number) => {
  return ([a, b]: number[], L: number): number => (H_max - H_min) / (1 + Math.exp(-a + b * L)) + H_min;
};

export const slopeParametersSelection = (L_values: number[], H_values: number[]) => {
  const H_max = Math.max(...H_values);
  const H_min = Math.min(...H_values);

  const logFunc = createLogisticFunction(H_min, H_max);

  const options = {
    damping: 1.5,
    initialValues: [1, 1], // Начальные приближения для a и b
    gradientDifference: 1e-6,
    maxIterations: 100,
    errorTolerance: 1e-6,
  };

  const coordinates = {
    x: L_values,
    y: H_values,
  };

  const fittedParams = levenbergMarquardt(coordinates, logFunc, options);

  return fittedParams.parameterValues;
};
