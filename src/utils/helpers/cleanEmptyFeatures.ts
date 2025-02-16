//TODO: add better types
export const cleanEmptyFeatures = (features: any[]) => {
  return features.filter((feature) => feature.geometry.coordinates.length > 0);
};
