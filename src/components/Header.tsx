import React from 'react';
import { Coffee } from 'lucide-react';
import VesselTypeToggle from './VesselTypeToggle';
import RefreshTimer from './RefreshTimer';
import { VesselType } from '../types';

interface HeaderProps {
  vesselType: VesselType;
  onVesselTypeChange: (type: VesselType) => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  vesselType, 
  onVesselTypeChange,
  onRefresh
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Coffee className="h-8 w-8 text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">What's Hot Today</h1>
              <p className="text-sm text-gray-500 mt-1">Signal Ocean Analytics</p>
            </div>
          </div>
          
          <div className="flex space-x-4 items-center">
            <VesselTypeToggle 
              vesselType={vesselType} 
              onVesselTypeChange={onVesselTypeChange} 
            />
            <RefreshTimer 
              onRefresh={onRefresh}
              interval={4 * 60 * 60 * 1000} // 4 hours
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;