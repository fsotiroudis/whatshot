import React from 'react';
import { getChangeColor } from '../utils/dataUtils';
import { HistoricalDataPoint } from '../types';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  weeklyChange?: number;
  monthlyChange?: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
  historicalData?: HistoricalDataPoint[];
  hideIfInsignificant?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  weeklyChange,
  monthlyChange,
  icon,
  isLoading = false,
  historicalData = [],
  hideIfInsignificant = true,
}) => {
  if (hideIfInsignificant && weeklyChange && Math.abs(weeklyChange) < 10) {
    return null;
  }

  const weeklyChangeColor = weeklyChange ? getChangeColor(weeklyChange) : '';
  const monthlyChangeColor = monthlyChange ? getChangeColor(monthlyChange) : '';

  // Generate curved sparkline path
  const getSparklinePath = () => {
    if (historicalData.length < 2) return '';
    
    const values = historicalData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    // For negative trends, flip the Y coordinates
    const isNegative = weeklyChange && weeklyChange < 0;
    const getY = (value: number) => {
      const normalizedValue = (value - min) / range;
      return isNegative 
        ? 20 + (normalizedValue * 60) // Start high, end low for negative trends
        : 80 - (normalizedValue * 60); // Start low, end high for positive trends
    };

    // Create curved path using cubic bezier curves
    let path = `M 0,${getY(historicalData[0].value)}`;
    
    for (let i = 1; i < historicalData.length; i++) {
      const x1 = ((i - 1) / (historicalData.length - 1)) * 100;
      const x2 = (i / (historicalData.length - 1)) * 100;
      const y1 = getY(historicalData[i - 1].value);
      const y2 = getY(historicalData[i].value);
      
      // Control points for the curve
      const cx1 = x1 + ((x2 - x1) / 3);
      const cx2 = x2 - ((x2 - x1) / 3);
      
      path += ` C ${cx1},${y1} ${cx2},${y2} ${x2},${y2}`;
    }
    
    return path;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
              {unit && <span className="ml-1 text-gray-500 text-sm">{unit}</span>}
            </div>
            
            {weeklyChange !== undefined && (
              <div className="mt-2">
                <span className={`${weeklyChangeColor} text-sm font-medium`}>
                  {weeklyChange > 0 ? '↑' : '↓'} {Math.abs(weeklyChange).toFixed(1)}%
                </span>
                <span className="text-gray-400 text-xs ml-1">vs last week</span>
              </div>
            )}
            
            {monthlyChange !== undefined && (
              <div className="mt-1">
                <span className={`${monthlyChangeColor} text-sm font-medium`}>
                  {monthlyChange > 0 ? '↑' : '↓'} {Math.abs(monthlyChange).toFixed(1)}%
                </span>
                <span className="text-gray-400 text-xs ml-1">vs last month</span>
              </div>
            )}
          </div>

          {historicalData.length > 0 && (
            <div className="w-24 h-16">
              <svg 
                className="w-full h-full" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                <path
                  d={getSparklinePath()}
                  fill="none"
                  stroke={weeklyChange && weeklyChange > 0 ? '#059669' : '#DC2626'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;