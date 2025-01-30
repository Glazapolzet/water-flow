export const makeBreaks = (breaksDelta: number) => {
  const MAX_EARTH_HEIGHT = 9999;
  const breaks: number[] = [];

  for (let br = breaksDelta; br < MAX_EARTH_HEIGHT; br += breaksDelta) {
    breaks.push(br);
  }

  return breaks;
};
