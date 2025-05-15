import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import { VesselType } from './types';
import VesselCountCard from './components/VesselCountCard';
import BalticRateCard from './components/BalticRateCard';
import CongestionVesselCountCard from './components/CongestionVesselCountCard';
import TonnageSupplyCard from './components/TonnageSupplyCard';
import VoyagesDemandCard from './components/VoyagesDemandCard';
import CongestionPortDaysCard from './components/CongestionPortDaysCard';
import InsightsCard from './components/InsightsCard';

interface SignificantChange {
  title: string;
  value: number;
  change: number;
  unit: string;
}

const Dashboard: React.FC = () => {
  const [vesselType, setVesselType] = useState<VesselType>('Dry');
  const today = new Date().toISOString().split('T')[0];
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(oneWeekAgo);
  const [significantChanges, setSignificantChanges] = useState<SignificantChange[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const handleSignificantChange = useCallback((change: SignificantChange) => {
    setSignificantChanges(prev => {
      const filtered = prev.filter(c => c.title !== change.title);
      return [...filtered, change];
    });
  }, []);

  const generateInsights = useCallback(async () => {
    if (significantChanges.length === 0) return;

    setIsLoadingInsights(true);
    try {
      const response = await fetch('http://localhost:4000/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics: significantChanges }),
      });

      if (!response.ok) throw new Error('Failed to generate insights');
      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [significantChanges]);

  useEffect(() => {
    generateInsights();
  }, [significantChanges, generateInsights]);

  const handleVesselTypeChange = (type: VesselType) => {
    setVesselType(type);
    setSignificantChanges([]);
    setInsights([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        vesselType={vesselType}
        onVesselTypeChange={handleVesselTypeChange}
        onRefresh={() => setSignificantChanges([])}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VesselCountCard
            dayDate={selectedDate}
            vesselType={vesselType}
            onSignificantChange={handleSignificantChange}
          />
          <BalticRateCard
            dayDate={selectedDate}
            vesselType={vesselType}
            onSignificantChange={handleSignificantChange}
          />
          <CongestionVesselCountCard
            dayDate={selectedDate}
            portName="Rotterdam"
            vesselType={vesselType}
            onSignificantChange={handleSignificantChange}
          />
          <CongestionPortDaysCard
            dayDate={selectedDate}
            portName="Rotterdam"
            vesselType={vesselType}
            onSignificantChange={handleSignificantChange}
          />
          <TonnageSupplyCard
            dayDate={selectedDate}
            vesselType={vesselType}
            portName="Houston"
            onSignificantChange={handleSignificantChange}
          />
          <VoyagesDemandCard
            dayDate={selectedDate}
            vesselType={vesselType}
            portName="US Gulf"
            onSignificantChange={handleSignificantChange}
          />
        </div>
        <div className="mt-6">
          <InsightsCard
            insights={insights}
            isLoading={isLoadingInsights}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;