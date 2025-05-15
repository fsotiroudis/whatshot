import React, { useEffect, useState } from 'react';

interface BalticRateRow {
  RATEDATE: string;
  ROUTEID: string;
  RATE: number;
  VESSELTYPE?: string;
  VESSELCLASS?: string;
  // Add other fields if needed
}

interface BalticRateCardProps {
  dayDate: string;
  vesselType: string;
}

const BalticRateCard: React.FC<BalticRateCardProps> = ({ dayDate, vesselType }) => {
  const [data, setData] = useState<BalticRateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/api/baltic-rate?dayDate=${encodeURIComponent(dayDate)}&vesselType=${encodeURIComponent(vesselType)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dayDate, vesselType]);

  if (loading) return <div className="bg-white rounded-lg shadow p-4 animate-pulse h-24" />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>No data found.</div>;

  // Find the row with the largest rate change
  const mostImportant = data.reduce((max, row) => {
    const prevDay = data.find(r => 
      r.ROUTEID === row.ROUTEID && 
      r.RATEDATE < row.RATEDATE
    );
    const prevRate = prevDay ? prevDay.RATE : null;
    const currentChange = prevRate !== null ? Math.abs((row.RATE - prevRate) / prevRate) * 100 : 0;
    
    const maxPrevDay = data.find(r => 
      r.ROUTEID === max.ROUTEID && 
      r.RATEDATE < max.RATEDATE
    );
    const maxPrevRate = maxPrevDay ? maxPrevDay.RATE : null;
    const maxChange = maxPrevRate !== null ? Math.abs((max.RATE - maxPrevRate) / maxPrevRate) * 100 : 0;
    
    return currentChange > maxChange ? row : max;
  }, data[0]);

  // Find previous day's rate for the same route
  const prevDay = data.find(row =>
    row.ROUTEID === mostImportant.ROUTEID &&
    row.RATEDATE < mostImportant.RATEDATE
  );
  const prevRate = prevDay ? prevDay.RATE : null;
  const change = prevRate !== null ? ((mostImportant.RATE - prevRate) / prevRate) * 100 : 0;
  const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500';
  const isSignificant = Math.abs(change) >= 10;

  if (!isSignificant) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm mb-1">Baltic Rate</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">
              {mostImportant.RATE.toLocaleString()}
            </span>
            <span className="ml-1 text-gray-500 text-sm">WS</span>
          </div>
          <div className="mt-1 flex items-center">
            <span className={`${changeColor} text-sm font-medium`}>
              {change > 0 ? '↑' : change < 0 ? '↓' : ''} {Math.abs(change).toFixed(1)}%
            </span>
            {Math.abs(change) >= 10 && (
              <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Significant
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 text-gray-700 text-xs">
        {mostImportant.ROUTEID} as of {mostImportant.RATEDATE}
        {mostImportant.VESSELTYPE && mostImportant.VESSELCLASS && (
          <span> — {mostImportant.VESSELTYPE} / {mostImportant.VESSELCLASS}</span>
        )}
      </div>
    </div>
  );
};

export default BalticRateCard; 