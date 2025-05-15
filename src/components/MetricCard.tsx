import React from 'react';
import { getChangeColor, isSignificantChange } from '../utils/dataUtils';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  weeklyChange?: number;
  monthlyChange?: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  weeklyChange,
  monthlyChange,
  icon,
  isLoading = false,
}) => {
  const weeklyChangeColor = weeklyChange ? getChangeColor(weeklyChange) : '';
  const monthlyChangeColor = monthlyChange ? getChangeColor(monthlyChange) : '';
  const isWeeklySignificant = weeklyChange ? isSignificantChange(weeklyChange) : false;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="ml-1 text-gray-500 text-sm">{unit}</span>}
          </div>
          
          {weeklyChange !== undefined && (
            <div className="mt-2 flex items-center">
              <span className={`text-sm ${weeklyChangeColor} font-medium flex items-center`}>
                {weeklyChange > 0 ? '↑' : weeklyChange < 0 ? '↓' : ''}
                {' '}
                {Math.abs(weeklyChange).toFixed(1)}%
                {isWeeklySignificant && 
                  <span className="ml-1 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                    Significant
                  </span>
                }
              </span>
              <span className="text-gray-400 text-xs ml-1">vs last week</span>
            </div>
          )}
          
          {monthlyChange !== undefined && (
            <div className="mt-1 flex items-center">
              <span className={`text-sm ${monthlyChangeColor} font-medium`}>
                {monthlyChange > 0 ? '↑' : monthlyChange < 0 ? '↓' : ''}
                {' '}
                {Math.abs(monthlyChange).toFixed(1)}%
              </span>
              <span className="text-gray-400 text-xs ml-1">vs last month</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MetricCard;