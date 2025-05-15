import React from 'react';

interface InsightsCardProps {
  insights: string[];
  isLoading: boolean;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm mb-1">Market Pulse</h3>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-gray-700 text-sm">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsightsCard;