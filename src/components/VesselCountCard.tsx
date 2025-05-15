import React, { useEffect, useState } from 'react';

interface VesselCountRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  CURRENTAREANAMELEVEL0: string;
  VESSEL_COUNT: number;
}

const VesselCountCard: React.FC = () => {
  const [data, setData] = useState<VesselCountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/vessel-count')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return <div>No data found.</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Vessel Count</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1">Day</th>
              <th className="px-2 py-1">Vessel Type</th>
              <th className="px-2 py-1">Vessel Class</th>
              <th className="px-2 py-1">Area</th>
              <th className="px-2 py-1">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{row.DAYDATE}</td>
                <td className="px-2 py-1">{row.VESSELTYPE}</td>
                <td className="px-2 py-1">{row.VESSELCLASS}</td>
                <td className="px-2 py-1">{row.CURRENTAREANAMELEVEL0}</td>
                <td className="px-2 py-1">{row.VESSEL_COUNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VesselCountCard; 