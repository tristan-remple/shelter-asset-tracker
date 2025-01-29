exports.calculateCurrentValue = (initialValue, createdAt, depreciationRate) => {
  try {
    initialValue = parseFloat(initialValue);
    if (!initialValue || !createdAt || !depreciationRate || isNaN(initialValue)) {
      throw new Error("Invalid input.");
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

exports.getEoL = (months, date) => {

  const offset = parseInt(months, 10);
  const startDate = date ? new Date(date) : new Date();

  if (offset === 0) {
    return startDate;
  }

  if (!offset || isNaN(offset)) {
    throw new Error("Invalid input.");
  };

  startDate.setMonth(startDate.getMonth() + months);

  return startDate;
};