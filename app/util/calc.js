exports.calculateCurrentValue = (initialValue, createdAt, depreciationRate) => {
  try {
      // Ensure the inputs are valid
      if (!initialValue || !createdAt || !depreciationRate) {
          throw new Error("Invalid input");
      }

      const now = new Date();
      const created = new Date(createdAt);

      depreciationRate = parseFloat(depreciationRate.value);

      const age = (now - created) / (1000 * 60 * 60 * 24 * 365);

      const currentValue = initialValue * Math.pow((1 - depreciationRate), age);

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