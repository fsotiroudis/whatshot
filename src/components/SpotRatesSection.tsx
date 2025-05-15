import React from 'react';
import { Anchor } from 'lucide-react';
import DataTable, { renderChangeCell } from './DataTable';
import { Route, VesselType } from '../types';
import { generateMockRoutes } from '../utils/dataUtils';

interface SpotRatesSectionProps {
  vesselType: VesselType;
  isLoading?: boolean;
}

const SpotRatesSection: React.FC<SpotRatesSectionProps> = ({ 
  vesselType,
  isLoading = false 
}) => {
  const routes = generateMockRoutes(vesselType);
  
  const columns = [
    { 
      header: 'Route', 
      accessor: 'name',
      className: 'font-medium' 
    },
    { 
      header: 'Origin',
      accessor: 'origin' 
    },
    { 
      header: 'Destination',
      accessor: 'destination' 
    },
    { 
      header: 'Spot Rate',
      accessor: (route: Route) => `$${route.spotRate.toFixed(2)}`,
      className: 'font-mono' 
    },
    { 
      header: 'Weekly Change', 
      accessor: (route: Route) => renderChangeCell(route.weeklyChange),
    },
    { 
      header: 'Monthly Change', 
      accessor: (route: Route) => renderChangeCell(route.monthlyChange),
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <div className="flex items-center mb-4">
        <Anchor className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-medium text-gray-800">Spot Rates by Major Routes</h3>
      </div>
      
      <DataTable 
        columns={columns}
        data={routes}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SpotRatesSection;