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
  // We want the graph to show the overall trend matching the weekly change
  const changePerDay = (weeklyChange / 7) / 100; // Convert weekly percentage to daily rate
  const startValue = currentValue / (1 + (changePerDay * points));
  
  for (let i = points; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Calculate the value for this point
    // Add small random variations while maintaining the overall trend
    const trendValue = startValue * (1 + (changePerDay * (points - i)));
    const randomVariation = (Math.random() - 0.5) * 0.02 * trendValue; // ±1% random variation
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