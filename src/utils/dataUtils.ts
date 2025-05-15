import { 
  Route, 
  Region, 
  Port, 
  BunkerPrice, 
  TonnageSupply, 
  CargoOrder, 
  VesselType, 
  SQLQuery, 
  HistoricalDataPoint 
} from '../types';

// Updated to generate trend-aligned data
export const generateHistoricalData = (currentValue: number, weeklyChange: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const points = 30; // 30 days of data
  
  // Calculate the starting value based on the weekly change
  const totalChange = weeklyChange / 100; // Convert percentage to decimal
  const startValue = currentValue / (1 + totalChange);
  
  for (let i = 0; i <= points; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (points - i));
    
    // Calculate progress through the period (0 to 1)
    const progress = i / points;
    
    // Use cubic easing for smoother curve
    const easedProgress = progress * progress * (3 - 2 * progress);
    
    // Calculate the base value following the trend
    const trendValue = startValue + (currentValue - startValue) * easedProgress;
    
    // Add small random variations while maintaining the overall trend
    const maxVariation = Math.abs(currentValue - startValue) * 0.1; // 10% of total change
    const randomVariation = (Math.random() - 0.5) * maxVariation;
    
    const value = trendValue + randomVariation;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(value.toFixed(2))
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