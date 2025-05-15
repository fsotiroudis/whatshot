import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { Anchor } from 'lucide-react';
import { generateHistoricalData } from '../utils/dataUtils';

interface BalticRateRow {
  RATEDATE: string;
  ROUTEID: string;
  RATE: number;
  VESSELTYPE?: string;
  VESSELCLASS?: string;
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

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.RATEDATE.localeCompare(a.RATEDATE));
  const latest = sorted[0];
  const previous = sorted[1];
  const prevRate = previous ? previous.RATE : null;
  const change = prevRate !== null ? ((latest.RATE - prevRate) / prevRate) * 100 : 0;

  // Generate historical data based on the current rate and weekly change
  const historicalData = generateHistoricalData(latest.RATE, change);

  return (
    <MetricCard
      title="Baltic Rate"
      value={latest.RATE}
      unit="WS"
      weeklyChange={change}
      icon={<Anchor size={20} />}
      isLoading={loading}
      historicalData={historicalData}
      hideIfInsignificant={true}
    />
  );
};

export default BalticRateCard;