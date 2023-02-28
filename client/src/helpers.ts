export const jacobsthal = (
  n: number,
  previousValues: number[] = []
): number => {
  if (previousValues[n]) {
    return previousValues[n];
  }
  let result;
  if (n < 2) {
    result = n;
  } else {
    result =
      jacobsthal(n - 1, previousValues) + 2 * jacobsthal(n - 2, previousValues);
  }
  previousValues[n] = result;
  return result;
};
