exports.calculateCurrentValue = (initialValue, depreciationRate, createdAt) => {
    const currentDate = new Date();
    const creationDate = new Date(createdAt);
    
    // Calculate the number of months that have passed since creation
    const monthsPassed = (currentDate.getFullYear() - creationDate.getFullYear()) * 12 +
        (currentDate.getMonth() - creationDate.getMonth());
    
    // Adjust yearly depreciation rate to monthly depreciation rate
    const monthlyDepreciationRate = Math.pow(1 - depreciationRate, 1 / 12);
    
    // Calculate depreciation
    const depreciation = Math.pow(monthlyDepreciationRate, monthsPassed);
    
    // Calculate current value
    const currentValue = initialValue * depreciation;
    
    return currentValue.toFixed(2);
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