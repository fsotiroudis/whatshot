import React, { useEffect, useState } from 'react';

interface CongestionVesselCountRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  PORTNAME: string;
  CONGESTEDVESSELS: number;
}

interface CongestionVesselCountCardProps {
  dayDate: string;
  portName: string;
  vesselType: string;
}

const CongestionVesselCountCard: React.FC<CongestionVesselCountCardProps> = ({ dayDate, portName, vesselType }) => {
  const [data, setData] = useState<CongestionVesselCountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/api/congestion-vessel-count?dayDate=${encodeURIComponent(dayDate)}&portName=${encodeURIComponent(portName)}&vesselType=${encodeURIComponent(vesselType)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dayDate, portName, vesselType]);

  if (loading) return <div className="bg-white rounded-lg shadow p-4 animate-pulse h-24" />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>No data found.</div>;

  // Sort by DAYDATE descending to get the latest and previous
  const sorted = [...data].sort((a, b) => b.DAYDATE.localeCompare(a.DAYDATE));
  const latest = sorted[0];
  const previous = sorted[1];
  const prevCount = previous ? previous.CONGESTEDVESSELS : null;
  const change = prevCount !== null ? ((latest.CONGESTEDVESSELS - prevCount) / prevCount) * 100 : 0;
  const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm mb-1">Congested Vessels</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">
              {latest.CONGESTEDVESSELS.toLocaleString()}
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
        {latest.VESSELTYPE} / {latest.VESSELCLASS} in {latest.PORTNAME} as of {latest.DAYDATE}
      </div>
    </div>
  );
};

export default CongestionVesselCountCard; 