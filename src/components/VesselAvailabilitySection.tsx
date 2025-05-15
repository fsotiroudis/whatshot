import React from 'react';
import { Ship } from 'lucide-react';
import DataTable, { renderChangeCell } from './DataTable';
import { Region, VesselType } from '../types';
import { generateMockRegions } from '../utils/dataUtils';

interface VesselAvailabilitySectionProps {
  vesselType: VesselType;
  isLoading?: boolean;
}

const VesselAvailabilitySection: React.FC<VesselAvailabilitySectionProps> = ({ 
  vesselType,
  isLoading = false 
}) => {
  const regions = generateMockRegions(vesselType);
  
  const columns = [
    { 
      header: 'Region', 
      accessor: 'name',
      className: 'font-medium' 
    },
    { 
      header: 'Available Vessels',
      accessor: 'vesselCount',
      className: 'font-mono' 
    },
    { 
      header: 'Weekly Change', 
      accessor: (region: Region) => renderChangeCell(region.weeklyChange),
    },
    { 
      header: 'Monthly Change', 
      accessor: (region: Region) => renderChangeCell(region.monthlyChange),
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <div className="flex items-center mb-4">
        <Ship className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-medium text-gray-800">Vessel Availability by Region</h3>
      </div>
      
      <DataTable 
        columns={columns}
        data={regions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default VesselAvailabilitySection;