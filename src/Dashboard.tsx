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

const Dashboard: React.FC = () => {
  const [vesselType, setVesselType] = useState<VesselType>('Dry');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<any[]>([]);

  // Use today's date as the initial date
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleVesselTypeChange = (type: VesselType) => {
    setVesselType(type);
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        vesselType={vesselType}
        onVesselTypeChange={handleVesselTypeChange}
        onRefresh={refreshData}
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
          />
          <BalticRateCard 
            dayDate={selectedDate} 
            vesselType={vesselType}
          />
          <CongestionVesselCountCard 
            dayDate={selectedDate} 
            portName="Rotterdam" 
            vesselType={vesselType}
          />
          <CongestionPortDaysCard 
            dayDate={selectedDate} 
            portName="Rotterdam" 
            vesselType={vesselType}
          />
          <TonnageSupplyCard 
            dayDate={selectedDate} 
            vesselType={vesselType} 
            portName="Houston"
          />
          <VoyagesDemandCard 
            dayDate={selectedDate} 
            vesselType={vesselType} 
            areaName="US Gulf"
          />
        </div>

        <div className="mt-8">
          <InsightsCard metrics={[
            {
              title: "Vessel Count",
              value: 250,
              change: 15,
              unit: "vessels"
            },
            {
              title: "Baltic Rate",
              value: 5500,
              change: -8,
              unit: "points"
            },
            {
              title: "Port Congestion",
              value: 12,
              change: 25,
              unit: "vessels"
            }
          ]} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;