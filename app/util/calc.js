exports.calculateCurrentValue = (initialValue, createdAt) => {
    const currentDate = new Date();
    const creationDate = new Date(createdAt);
  return 0;
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