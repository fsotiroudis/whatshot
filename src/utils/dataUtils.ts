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

export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
};

export const generateInsights = (vesselType: string): string[] => {
  // Generate relevant market insights based on vessel type
  const insights = [
    `${vesselType} vessel market showing steady demand in major trade routes`,
    `Port congestion for ${vesselType} vessels decreased by 15% in key terminals`,
    `Average waiting time for ${vesselType} vessels reduced to 2.5 days`,
    `Spot rates for ${vesselType} vessels remain stable in current market conditions`
  ];
  
  return insights;
};