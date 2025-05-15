import React, { useEffect, useState } from 'react';

interface VesselCountRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  CURRENTAREANAMELEVEL0: string;
  VESSELCOUNT: number;
}

interface VesselCountCardProps {
  dayDate: string;
  vesselType: string;
}

const VesselCountCard: React.FC<VesselCountCardProps> = ({ dayDate, vesselType }) => {
  const [data, setData] = useState<VesselCountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/api/vessel-count?dayDate=${encodeURIComponent(dayDate)}&vesselType=${vesselType}`)
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

  // Find the row with the largest vessel count
  const mostImportant = data.reduce((max, row) =>
    row.VESSELCOUNT > max.VESSELCOUNT ? row : max, data[0]
  );

  // Find previous day's count for the same group (if available)
  const prevDay = data.find(row =>
    row.VESSELTYPE === mostImportant.VESSELTYPE &&
    row.VESSELCLASS === mostImportant.VESSELCLASS &&
    row.CURRENTAREANAMELEVEL0 === mostImportant.CURRENTAREANAMELEVEL0 &&
    row.DAYDATE < mostImportant.DAYDATE
  );
  const prevCount = prevDay ? prevDay.VESSELCOUNT : null;
  const change = prevCount !== null ? ((mostImportant.VESSELCOUNT - prevCount) / prevCount) * 100 : 0;
  const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500';
  const isSignificant = Math.abs(change) >= 10;

  if (!isSignificant) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm mb-1">Vessel Count (Most Significant)</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">
              {mostImportant.VESSELCOUNT.toLocaleString()}
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
        {mostImportant.VESSELTYPE} / {mostImportant.VESSELCLASS} in {mostImportant.CURRENTAREANAMELEVEL0} <br />
        <span className="text-gray-400">as of {mostImportant.DAYDATE}</span>
      </div>
    </div>
  );
};

export default VesselCountCard; 