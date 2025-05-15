import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { Ship } from 'lucide-react';
import { generateHistoricalData } from '../utils/dataUtils';

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

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.DAYDATE.localeCompare(a.DAYDATE));
  const latest = sorted[0];
  const previous = sorted[1];
  const prevDemand = previous ? previous.DEMAND : null;
  const change = prevDemand !== null ? ((latest.DEMAND - prevDemand) / prevDemand) * 100 : 0;

  // Generate historical data based on the current demand and weekly change
  const historicalData = generateHistoricalData(latest.DEMAND, change);

  return (
    <MetricCard
      title="Voyages Demand"
      value={latest.DEMAND}
      unit="tons"
      weeklyChange={change}
      icon={<Ship size={20} />}
      isLoading={loading}
      historicalData={historicalData}
      hideIfInsignificant={true}
    />
  );
};

export default VoyagesDemandCard;