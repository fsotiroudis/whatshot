// Add this function to your existing dataUtils.ts
export const generateHistoricalData = (baseValue: number, points: number = 30): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentValue = baseValue;
  
  for (let i = points; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation (-5% to +5%)
    const variation = (Math.random() - 0.5) * 0.1;
    currentValue = currentValue * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(currentValue.toFixed(2))
    });
  }
  
  return data;
};