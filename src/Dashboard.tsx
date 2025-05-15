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
  const [isLoading, setIsLoading] = useState(false);

  // Use today's date as the initial date
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setInsights(generateInsights(vesselType));
      setIsLoading(false);
    }, 500);
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

        {insights.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Market Insights</h3>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start text-gray-700">
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