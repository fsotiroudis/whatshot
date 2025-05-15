import React, { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface Metric {
  title: string;
  value: number;
  change: number;
  unit: string;
}

interface InsightsCardProps {
  metrics: Metric[];
  isLoading?: boolean;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ metrics, isLoading = false }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateInsights = async () => {
      if (!metrics.length || isLoading) return;
      
      setIsGenerating(true);
      try {
        const response = await fetch('http://localhost:4000/api/generate-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metrics }),
        });

        if (!response.ok) throw new Error('Failed to generate insights');
        
        const data = await response.json();
        setInsights(data.insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate insights');
      } finally {
        setIsGenerating(false);
      }
    };

    generateInsights();
  }, [metrics, isLoading]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Lightbulb className="text-amber-500 mr-2" size={20} />
        <h3 className="text-lg font-medium text-gray-900">Market Insights</h3>
      </div>

      {isLoading || isGenerating ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <span className="text-blue-600 mr-2">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InsightsCard;