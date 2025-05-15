import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import { Ship } from 'lucide-react';
import { generateHistoricalData } from '../utils/dataUtils';

interface VesselCountRow {
  DAYDATE: string;
  VESSELTYPE: string;
  VESSELCLASS: string;
  CURRENTAREANAMELEVEL0: string;
  VESSEL_COUNT: number;
}

interface VesselCountCardProps {
  dayDate: string;
  vesselType: string;
  onMetricUpdate: (metric: any) => void;
}

const VesselCountCard: React.FC<VesselCountCardProps> = ({ dayDate, vesselType, onMetricUpdate }) => {
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
      .then(data => {
        setData(data);
        if (data.length > 0) {
          const sorted = [...data].sort((a, b) => b.DAYDATE.localeCompare(a.DAYDATE));
          const latest = sorted[0];
          const previous = sorted[1];
          const prevCount = previous ? previous.VESSEL_COUNT : null;
          const change = prevCount !== null ? ((latest.VESSEL_COUNT - prevCount) / prevCount) * 100 : 0;
          
          onMetricUpdate({
            title: 'Vessel Count',
            value: latest.VESSEL_COUNT,
            change,
            unit: 'vessels',
            area: latest.CURRENTAREANAMELEVEL0,
            vesselType: latest.VESSELTYPE,
            vesselClass: latest.VESSELCLASS
          });
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [dayDate, vesselType, onMetricUpdate]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.DAYDATE.localeCompare(a.DAYDATE));
  const latest = sorted[0];
  const previous = sorted[1];
  const prevCount = previous ? previous.VESSEL_COUNT : null;
  const change = prevCount !== null ? ((latest.VESSEL_COUNT - prevCount) / prevCount) * 100 : 0;

  const historicalData = generateHistoricalData(latest.VESSEL_COUNT, change);

  return (
    <MetricCard
      title="Vessel Count"
      value={latest.VESSEL_COUNT}
      unit="vessels"
      weeklyChange={change}
      icon={<Ship size={20} />}
      isLoading={loading}
      historicalData={historicalData}
      hideIfInsignificant={false}
    />
  );
};

export default VesselCountCard;