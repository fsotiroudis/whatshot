import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import { VesselType } from './types';
import { generateInsights, generateHistoricalData } from './utils/dataUtils';
import TrendCard from './components/TrendCard';
import VesselCountCard from './components/VesselCountCard';

const Dashboard: React.FC = () => {
  const [vesselType, setVesselType] = useState<VesselType>('Dry Bulk');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [spotRateHistory, setSpotRateHistory] = useState(generateHistoricalData(18.5, 0.15));
  const [bunkerPriceHistory, setBunkerPriceHistory] = useState(generateHistoricalData(570, 0.1));
  const [congestionHistory, setCongestionHistory] = useState(generateHistoricalData(6.8, 0.05));
  
  const refreshData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setInsights(generateInsights(vesselType));
      setSpotRateHistory(generateHistoricalData(vesselType === 'Dry Bulk' ? 18.5 : 45.2, 0.15));
      setBunkerPriceHistory(generateHistoricalData(570, 0.1));
      setCongestionHistory(generateHistoricalData(6.8, 0.05));
      setIsLoading(false);
    }, 1000);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TrendCard
            title="Spot Rate"
            value={spotRateHistory[spotRateHistory.length - 1].value}
            unit={vesselType === 'Dry Bulk' ? '$/ton' : '$/barrel'}
            change={((spotRateHistory[spotRateHistory.length - 1].value - spotRateHistory[0].value) / spotRateHistory[0].value) * 100}
            data={spotRateHistory}
            isLoading={isLoading}
          />
          <TrendCard
            title="Bunker Price"
            value={bunkerPriceHistory[bunkerPriceHistory.length - 1].value}
            unit="$/mt"
            change={((bunkerPriceHistory[bunkerPriceHistory.length - 1].value - bunkerPriceHistory[0].value) / bunkerPriceHistory[0].value) * 100}
            data={bunkerPriceHistory}
            isLoading={isLoading}
          />
          <TrendCard
            title="Port Congestion"
            value={congestionHistory[congestionHistory.length - 1].value}
            unit="/10"
            change={((congestionHistory[congestionHistory.length - 1].value - congestionHistory[0].value) / congestionHistory[0].value) * 100}
            data={congestionHistory}
            isLoading={isLoading}
          />
        </div>
        
        {insights.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
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
        <div className="mt-6">
          <VesselCountCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;