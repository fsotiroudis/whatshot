import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import { VesselType } from './types';
import { generateInsights } from './utils/dataUtils';
import VesselCountCard from './components/VesselCountCard';
import BalticRateCard from './components/BalticRateCard';
import CongestionVesselCountCard from './components/CongestionVesselCountCard';
import TonnageSupplyCard from './components/TonnageSupplyCard';
import VoyagesDemandCard from './components/VoyagesDemandCard';
import CongestionPortDaysCard from './components/CongestionPortDaysCard';

const Dashboard: React.FC = () => {
  const [vesselType, setVesselType] = useState<VesselType>('Dry');
  const [insights, setInsights] = useState<string[]>([]);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(sevenDaysAgo);

  const refreshData = useCallback(() => {
    setInsights(generateInsights(vesselType));
  }, [vesselType]);

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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1 mb-4"
            value={selectedDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VesselCountCard dayDate={selectedDate} vesselType={vesselType} />
          <BalticRateCard dayDate={selectedDate} vesselType={vesselType} />
          <CongestionVesselCountCard dayDate={selectedDate} portName="Rotterdam" vesselType={vesselType} />
          <CongestionPortDaysCard dayDate={selectedDate} portName="Rotterdam" vesselType={vesselType} />
          <TonnageSupplyCard dayDate={selectedDate} vesselType={vesselType} portName="Houston" />
          <VoyagesDemandCard dayDate={selectedDate} vesselType={vesselType} areaName="US Gulf" />
        </div>
        {insights.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-2">Key Changes</h3>
            <ul className="space-y-2">
              {insights.slice(0, 3).map((insight, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;