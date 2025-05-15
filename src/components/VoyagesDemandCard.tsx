import React, { useEffect, useState } from 'react';

interface VoyagesDemandRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  AREANAME: string;
  DEMAND: number;
}

interface VoyagesDemandCardProps {
  dayDate: string;
  vesselType: string;
  areaName: string;
}

const VoyagesDemandCard: React.FC<VoyagesDemandCardProps> = ({ dayDate, vesselType, areaName }) => {
  const [data, setData] = useState<VoyagesDemandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/api/voyages-demand?dayDate=${encodeURIComponent(dayDate)}&vesselType=${encodeURIComponent(vesselType)}&areaName=${encodeURIComponent(areaName)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dayDate, vesselType, areaName]);

  if (loading) return <div className="bg-white rounded-lg shadow p-4 animate-pulse h-24" />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>No data found.</div>;

  // Find the row with the largest demand change
  const mostImportant = data.reduce((max, row) => {
    const prevDay = data.find(r => 
      r.VESSELTYPE === row.VESSELTYPE && 
      r.VESSELCLASS === row.VESSELCLASS &&
      r.AREANAME === row.AREANAME &&
      r.DAYDATE < row.DAYDATE
    );
    const prevDemand = prevDay ? prevDay.DEMAND : null;
    const currentChange = prevDemand !== null ? Math.abs((row.DEMAND - prevDemand) / prevDemand) * 100 : 0;
    
    const maxPrevDay = data.find(r => 
      r.VESSELTYPE === max.VESSELTYPE && 
      r.VESSELCLASS === max.VESSELCLASS &&
      r.AREANAME === max.AREANAME &&
      r.DAYDATE < max.DAYDATE
    );
    const maxPrevDemand = maxPrevDay ? maxPrevDay.DEMAND : null;
    const maxChange = maxPrevDemand !== null ? Math.abs((max.DEMAND - maxPrevDemand) / maxPrevDemand) * 100 : 0;
    
    return currentChange > maxChange ? row : max;
  }, data[0]);

  // Find previous day's demand for the same group
  const prevDay = data.find(row =>
    row.VESSELTYPE === mostImportant.VESSELTYPE &&
    row.VESSELCLASS === mostImportant.VESSELCLASS &&
    row.AREANAME === mostImportant.AREANAME &&
    row.DAYDATE < mostImportant.DAYDATE
  );
  const prevDemand = prevDay ? prevDay.DEMAND : null;
  const change = prevDemand !== null ? ((mostImportant.DEMAND - prevDemand) / prevDemand) * 100 : 0;
  const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500';
  const isSignificant = Math.abs(change) >= 10;

  if (!isSignificant) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm mb-1">Voyage Demand</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">
              {mostImportant.DEMAND.toLocaleString()}
            </span>
            <span className="ml-1 text-gray-500 text-sm">vessels</span>
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
        {mostImportant.VESSELTYPE} / {mostImportant.VESSELCLASS} in {mostImportant.AREANAME} as of {mostImportant.DAYDATE}
      </div>
    </div>
  );
};

export default VoyagesDemandCard; 