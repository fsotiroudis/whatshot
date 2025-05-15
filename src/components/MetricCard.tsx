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
  // Hide card if changes are insignificant
  if (hideIfInsignificant && weeklyChange && Math.abs(weeklyChange) < 10) {
    return null;
  }

  const weeklyChangeColor = weeklyChange ? getChangeColor(weeklyChange) : '';
  const monthlyChangeColor = monthlyChange ? getChangeColor(monthlyChange) : '';

  // Calculate sparkline points with improved trend visualization
  const getSparklinePoints = () => {
    if (historicalData.length < 2) return '';
    
    const values = historicalData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    // Adjust the Y-scale to emphasize the trend
    // For positive trends, start from bottom (80) to top (20)
    // For negative trends, start from top (20) to bottom (80)
    const baseY = weeklyChange && weeklyChange > 0 ? 80 : 20;
    const targetY = weeklyChange && weeklyChange > 0 ? 20 : 80;
    
    return historicalData.map((point, i) => {
      const x = (i / (historicalData.length - 1)) * 100;
      const normalizedValue = (point.value - min) / range;
      const y = baseY + (normalizedValue * (targetY - baseY));
      return `${x},${y}`;
    }).join(' ');
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
                <polyline
                  points={getSparklinePoints()}
                  fill="none"
                  stroke={weeklyChange && weeklyChange > 0 ? '#059669' : '#DC2626'}
                  strokeWidth="2"
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