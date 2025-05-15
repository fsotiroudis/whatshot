import React from 'react';
import { Anchor } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Anchor className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-lg font-semibold text-gray-900">Signal Ocean</h1>
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