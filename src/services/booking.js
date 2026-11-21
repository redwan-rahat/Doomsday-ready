export function calculateBooking(bundleSizes, groupSize) {
  const dp = Array(groupSize + 1).fill(Infinity);
  const lastBundle = Array(groupSize + 1).fill(null);

  dp[0] = 0;

  for (let seats = 1; seats <= groupSize; seats++) {
    for (const bundleSize of bundleSizes) {
      if (bundleSize <= seats && dp[seats - bundleSize] !== Infinity) {
        const count = dp[seats - bundleSize] + 1;

        if (count < dp[seats]) {
          dp[seats] = count;
          lastBundle[seats] = bundleSize;
        }
      }
    }
  }

  if (dp[groupSize] === Infinity) {
    return null;
  }

  const bundles = {};
  let remainingSeats = groupSize;

  while (remainingSeats > 0) {
    const bundleSize = lastBundle[remainingSeats];

    bundles[bundleSize] = (bundles[bundleSize] || 0) + 1;
    remainingSeats -= bundleSize;
  }

  return {
    totalBundles: dp[groupSize],
    bundles,
  };
}
