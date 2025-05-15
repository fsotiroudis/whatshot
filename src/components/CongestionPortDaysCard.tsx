import React, { useEffect, useState } from 'react';

interface CongestionPortDaysRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  PORTNAME: string;
  CONGESTEDVESSELS: number;
}

interface CongestionPortDaysCardProps {
  dayDate: string;
  portName: string;
  vesselType: string;
  onSignificantChange?: (change: {
    title: string;
    value: number;
    change: number;
    unit: string;
  }) => void;
}

const CongestionPortDaysCard: React.FC<CongestionPortDaysCardProps> = ({ dayDate, portName, vesselType, onSignificantChange }) => {
  const [data, setData] = useState<CongestionPortDaysRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetch(`http://localhost:4000/api/congestion-port-days?dayDate=${encodeURIComponent(dayDate)}&portName=${encodeURIComponent(portName)}&vesselType=${encodeURIComponent(vesselType)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        console.log('Received data:', data);
        setData(data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
      });
  }, [dayDate, portName, vesselType]);

  useEffect(() => {
    if (!data.length || !onSignificantChange) return;

    const mostImportant = data.reduce((max, row) => {
      const prevDay = data.find(r => 
        r.VESSELTYPE === row.VESSELTYPE && 
        r.VESSELCLASS === row.VESSELCLASS &&
        r.PORTNAME === row.PORTNAME &&
        r.DAYDATE < row.DAYDATE
      );
      const prevCount = prevDay ? prevDay.CONGESTEDVESSELS : null;
      const currentChange = prevCount !== null ? Math.abs((row.CONGESTEDVESSELS - prevCount) / prevCount) * 100 : 0;
      
      const maxPrevDay = data.find(r => 
        r.VESSELTYPE === max.VESSELTYPE && 
        r.VESSELCLASS === max.VESSELCLASS &&
        r.PORTNAME === max.PORTNAME &&
        r.DAYDATE < max.DAYDATE
      );
      const maxPrevCount = maxPrevDay ? maxPrevDay.CONGESTEDVESSELS : null;
      const maxChange = maxPrevCount !== null ? Math.abs((max.CONGESTEDVESSELS - maxPrevCount) / maxPrevCount) * 100 : 0;
      
      return currentChange > maxChange ? row : max;
    }, data[0]);

    const prevDay = data.find(row =>
      row.VESSELTYPE === mostImportant.VESSELTYPE &&
      row.VESSELCLASS === mostImportant.VESSELCLASS &&
      row.PORTNAME === mostImportant.PORTNAME &&
      row.DAYDATE < mostImportant.DAYDATE
    );
    const prevCount = prevDay ? prevDay.CONGESTEDVESSELS : null;
    const change = prevCount !== null ? ((mostImportant.CONGESTEDVESSELS - prevCount) / prevCount) * 100 : 0;
    const isSignificant = Math.abs(change) >= 10;

    if (isSignificant) {
      onSignificantChange({
        title: "Port Congestion Days",
        value: mostImportant.CONGESTEDVESSELS,
        change: change,
        unit: "days"
      });
    }
  }, [data, onSignificantChange]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data || !data.length) return null;

  const mostImportant = data.reduce((max, row) => {
    const prevDay = data.find(r => 
      r.VESSELTYPE === row.VESSELTYPE && 
      r.VESSELCLASS === row.VESSELCLASS &&
      r.PORTNAME === row.PORTNAME &&
      r.DAYDATE < row.DAYDATE
    );
    const prevCount = prevDay ? prevDay.CONGESTEDVESSELS : null;
    const currentChange = prevCount !== null ? Math.abs((row.CONGESTEDVESSELS - prevCount) / prevCount) * 100 : 0;
    
    const maxPrevDay = data.find(r => 
      r.VESSELTYPE === max.VESSELTYPE && 
      r.VESSELCLASS === max.VESSELCLASS &&
      r.PORTNAME === max.PORTNAME &&
      r.DAYDATE < max.DAYDATE
    );
    const maxPrevCount = maxPrevDay ? maxPrevDay.CONGESTEDVESSELS : null;
    const maxChange = maxPrevCount !== null ? Math.abs((max.CONGESTEDVESSELS - maxPrevCount) / maxPrevCount) * 100 : 0;
    
    return currentChange > maxChange ? row : max;
  }, data[0]);

  const prevDay = data.find(row =>
    row.VESSELTYPE === mostImportant.VESSELTYPE &&
    row.VESSELCLASS === mostImportant.VESSELCLASS &&
    row.PORTNAME === mostImportant.PORTNAME &&
    row.DAYDATE < mostImportant.DAYDATE
  );
  const prevCount = prevDay ? prevDay.CONGESTEDVESSELS : null;
  const change = prevCount !== null ? ((mostImportant.CONGESTEDVESSELS - prevCount) / prevCount) * 100 : 0;
  const changeColor = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500';
  const isSignificant = Math.abs(change) >= 10;

  if (!isSignificant) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm mb-1">Port Congestion Days</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">
              {mostImportant.CONGESTEDVESSELS}
            </span>
            <span className="ml-1 text-gray-500 text-sm">days</span>
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
        {mostImportant.VESSELTYPE} / {mostImportant.VESSELCLASS} in {mostImportant.PORTNAME} as of {mostImportant.DAYDATE}
      </div>
    </div>
  );
};

export default CongestionPortDaysCard; 