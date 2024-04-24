exports.calculateCurrentValue = (initialValue, depreciationRate, createdAt) => {
    const currentDate = new Date();
    const quartersElapsed = (currentDate.getFullYear() - createdAt.getFullYear()) * 4 + Math.floor((currentDate.getMonth() - createdAt.getMonth()) / 3);
    return (initialValue * Math.pow((1 - depreciationRate), quartersElapsed)).toFixed(2);
  };