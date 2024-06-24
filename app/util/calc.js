exports.calculateCurrentValue = (initialValue, createdAt, depreciationRate) => {
  try {

  } catch(err) {

  }
}

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