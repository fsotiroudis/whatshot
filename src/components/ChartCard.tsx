import React from 'react';
import { HistoricalDataPoint } from '../types';

interface ChartCardProps {
  title: string;
  data: HistoricalDataPoint[];
  unit?: string;
  isLoading?: boolean;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  unit,
  isLoading = false,
}) => {
  // Find min and max for scaling
  const values = data.map(point => point.value);
  const min = Math.min(...values) * 0.9;
  const max = Math.max(...values) * 1.1;
  const range = max - min;
  
  // Calculate points for the sparkline
  const getY = (value: number) => {
    return 50 - ((value - min) / range) * 40;
  };
  
  // Generate points for the sparkline path
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = getY(point.value);
    return `${x},${y}`;
  }).join(' ');
  
  // Get the most recent value
  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;
  
  // Determine if trend is up or down
  const firstValue = data.length > 0 ? data[0].value : 0;
  const trend = currentValue > firstValue ? 'up' : currentValue < firstValue ? 'down' : 'flat';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg border border-gray-100">
      <h3 className="text-gray-500 text-sm font-medium mb-3">{title}</h3>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {currentValue.toLocaleString()}
            </span>
            {unit && <span className="ml-1 text-gray-500 text-sm">{unit}</span>}
          </div>
          
          <div className="h-32 w-full relative">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 50" 
              preserveAspectRatio="none"
            >
              <polyline
                points={points}
                fill="none"
                stroke={trend === 'up' ? '#2CA6A4' : '#F87171'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-700 ease-in-out"
              />
              <path
                d={`M0,50 L0,${getY(data[0].value)} L${points} L100,50 Z`}
                fill={trend === 'up' ? 'rgba(44, 166, 164, 0.1)' : 'rgba(248, 113, 113, 0.1)'}
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
            
            {/* X-axis labels (first, middle, last dates) */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{data.length > 0 ? data[0].date.split('-').slice(1).join('/') : ''}</span>
              <span>{data.length > 0 ? data[Math.floor(data.length / 2)].date.split('-').slice(1).join('/') : ''}</span>
              <span>{data.length > 0 ? data[data.length - 1].date.split('-').slice(1).join('/') : ''}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartCard;