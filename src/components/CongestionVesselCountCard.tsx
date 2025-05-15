import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { Ship } from 'lucide-react';
import { generateHistoricalData } from '../utils/dataUtils';

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

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.DAYDATE.localeCompare(a.DAYDATE));
  const latest = sorted[0];
  const previous = sorted[1];
  const prevCount = previous ? previous.CONGESTEDVESSELS : null;
  const change = prevCount !== null ? ((latest.CONGESTEDVESSELS - prevCount) / prevCount) * 100 : 0;

  // Generate historical data based on the current congested vessels count and weekly change
  const historicalData = generateHistoricalData(latest.CONGESTEDVESSELS, change);

  return (
    <MetricCard
      title="Congested Vessels"
      value={latest.CONGESTEDVESSELS}
      unit="vessels"
      weeklyChange={change}
      icon={<Ship size={20} />}
      isLoading={loading}
      historicalData={historicalData}
      hideIfInsignificant={true}
    />
  );
};

export default CongestionVesselCountCard;