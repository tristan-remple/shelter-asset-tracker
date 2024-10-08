exports.calculateCurrentValue = (initialValue, createdAt, depreciationRate) => {
  try {
    // Ensure the inputs are valid
    if (!initialValue || !createdAt || !depreciationRate) {
      throw new Error("Invalid input");
    }

    const now = new Date();
    const created = new Date(createdAt);

    // Calculate the age of the asset in years
    const age = (now - created) / (1000 * 60 * 60 * 24 * 365);

    // Ensure depreciationRate is a float
    depreciationRate = parseFloat(depreciationRate.value);

    // Double the straight-line depreciation rate
    const doubleDepreciationRate = depreciationRate * 2;

    let currentValue = initialValue;

    // Apply the double-declining balance method
    for (let year = 0; year < age; year++) {
      currentValue -= currentValue * doubleDepreciationRate;
    }

    return currentValue.toFixed(2);
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.getEoL = (months, startDate) => {
  // Check if passed valid startDate
  // If not, generate new date
  if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
    startDate = new Date();
  }

  // Add specified months
  startDate.setMonth(startDate.getMonth() + months);

  return startDate.getTime();
}