import { levenbergMarquardt } from 'ml-levenberg-marquardt';

function createLogisticFunction(H_min: number, H_max: number) {
  return function logisticFunc([a, b]: number[]) {
    return (L: number) => (H_max - H_min) / (1 + Math.exp(-a + b * L)) + H_min;
  };
}

export const slopeParametersSelection = (L_values: number[], H_values: number[]) => {
  const H_max = Math.max(...H_values);
  const H_min = Math.min(...H_values);

  const logFunc = createLogisticFunction(H_min, H_max);

  const options = {
    damping: 1.5,
    initialValues: [0, 1], // Initial approximations for a and b
    gradientDifference: 1e-6,
    maxIterations: 1000,
    errorTolerance: 1e-6,
  };

  const coordinates = {
    x: L_values,
    y: H_values,
  };

  const fittedParams = levenbergMarquardt(coordinates, logFunc, options);

  console.log(fittedParams);

  return fittedParams.parameterValues;
};
