import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { Ship } from 'lucide-react';
import { generateHistoricalData } from '../utils/dataUtils';

interface TonnageSupplyRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  PORTNAME: string;
  SUPPLY: number;
}

interface TonnageSupplyCardProps {
  dayDate: string;
  vesselType: string;
  portName: string;
}

const TonnageSupplyCard: React.FC<TonnageSupplyCardProps> = ({ dayDate, vesselType, portName }) => {
  const [data, setData] = useState<TonnageSupplyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:4000/api/tonnage-supply?dayDate=${encodeURIComponent(dayDate)}&vesselType=${encodeURIComponent(vesselType)}&portName=${encodeURIComponent(portName)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dayDate, vesselType, portName]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.DAYDATE.localeCompare(a.DAYDATE));
  const latest = sorted[0];
  const previous = sorted[1];
  const prevSupply = previous ? previous.SUPPLY : null;
  const change = prevSupply !== null ? ((latest.SUPPLY - prevSupply) / prevSupply) * 100 : 0;

  // Generate historical data based on the current supply
  const historicalData = generateHistoricalData(latest.SUPPLY);

  return (
    <MetricCard
      title="Tonnage Supply"
      value={latest.SUPPLY}
      unit="vessels"
      weeklyChange={change}
      icon={<Ship size={20} />}
      isLoading={loading}
      historicalData={historicalData}
      hideIfInsignificant={true}
    />
  );
};

export default TonnageSupplyCard;