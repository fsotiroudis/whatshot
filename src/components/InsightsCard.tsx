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
        setInsights(data.insights || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate insights');
        setInsights([]);
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
        <h3 className="text-lg font-medium text-gray-900">Quick Takes</h3>
      </div>

      {isLoading || isGenerating ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 rounded-md bg-red-50">
          <p>Whoops! Our crystal ball needs polishing. Try again?</p>
        </div>
      ) : insights.length > 0 ? (
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li 
              key={index} 
              className="text-gray-600 hover:bg-blue-50 p-2 rounded-md transition-colors cursor-pointer"
            >
              {insight}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Scanning the seven seas... ⚓️</p>
      )}
    </div>
  );
};

export default InsightsCard;