import React from 'react';
import { Lightbulb } from 'lucide-react';

interface InsightsCardProps {
  insights: string[];
  isLoading?: boolean;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insights, isLoading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-4">
        <Lightbulb className="text-amber-500 mr-2" size={20} />
        <h3 className="text-gray-800 font-medium">Market Insights</h3>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : (
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-2 mt-0.5">•</span>
              <span className="text-gray-700 text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default InsightsCard;