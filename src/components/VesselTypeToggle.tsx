import React from 'react';
import { VesselType } from '../types';

interface VesselTypeToggleProps {
  vesselType: VesselType;
  onVesselTypeChange: (type: VesselType) => void;
}

const VesselTypeToggle: React.FC<VesselTypeToggleProps> = ({ 
  vesselType, 
  onVesselTypeChange 
}) => {
  return (
    <div className="inline-flex rounded-md shadow-sm bg-gray-100" role="group">
      <button
        type="button"
        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
          vesselType === 'Dry Bulk'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } transition-colors duration-200 ease-in-out`}
        onClick={() => onVesselTypeChange('Dry Bulk')}
      >
        Dry Bulk
      </button>
      <button
        type="button"
        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
          vesselType === 'Tanker'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } transition-colors duration-200 ease-in-out`}
        onClick={() => onVesselTypeChange('Tanker')}
      >
        Tanker
      </button>
    </div>
  );
};

export default VesselTypeToggle;