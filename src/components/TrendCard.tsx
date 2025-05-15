import React from 'react';
import { HistoricalDataPoint } from '../types';

interface TrendCardProps {
  title: string;
  value: number;
  unit: string;
  change: number;
  data?: HistoricalDataPoint[];
  isLoading?: boolean;
}

const TrendCard: React.FC<TrendCardProps> = ({
  title,
  value,
  unit,
  change,
  data = [],
  isLoading = false,
}) => {
  const isSignificant = Math.abs(change) >= 10;
  const changeColor = change > 0 ? 'text-green-600' : 'text-red-600';
  
  // Calculate sparkline points
  const getSparklinePoints = () => {
    if (!data.length) return '';
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    return data.map((point, i) => {
      const x = (i / (data.length - 1)) * 60;
      const y = 30 - ((point.value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <div className="mt-1 flex items-center justify-between">
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">
                  {value.toLocaleString()}
                </span>
                <span className="ml-1 text-gray-500 text-sm">{unit}</span>
              </div>
              <div className="mt-1 flex items-center">
                <span className={`${changeColor} text-sm font-medium`}>
                  {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                </span>
                {isSignificant && (
                  <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Significant
                  </span>
                )}
              </div>
            </div>
            {data.length > 0 && (
              <div className="w-16 h-8">
                <svg className="w-full h-full" viewBox="0 0 60 30">
                  <polyline
                    points={getSparklinePoints()}
                    fill="none"
                    stroke={change >= 0 ? '#059669' : '#DC2626'}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrendCard;