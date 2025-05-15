import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshTimerProps {
  onRefresh: () => void;
  interval: number; // in milliseconds
}

const RefreshTimer: React.FC<RefreshTimerProps> = ({ onRefresh, interval }) => {
  const [timeRemaining, setTimeRemaining] = useState(interval);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = (timeRemaining / interval) * 100;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          handleRefresh();
          return interval;
        }
        return prev - 1000;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [interval]);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      setTimeRemaining(interval);
    }, 1000);
  };
  
  return (
    <div className="flex items-center">
      <div className="relative h-8 w-8 mr-2">
        <svg className="w-8 h-8" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#2CA6A4"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={100 - progressPercentage}
            className="transform -rotate-90 origin-center transition-all duration-1000 ease-linear"
          />
        </svg>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="absolute inset-0 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <RefreshCw 
            size={16} 
            className={`${isRefreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      <div>
        <div className="text-xs text-gray-500">Next refresh in</div>
        <div className="text-sm font-medium">{formatTimeRemaining()}</div>
      </div>
    </div>
  );
};

export default RefreshTimer;