import React from 'react';
import { Anchor } from 'lucide-react';
import DataTable, { renderChangeCell } from './DataTable';
import { Port, VesselType } from '../types';
import { generateMockPorts } from '../utils/dataUtils';

interface PortCongestionSectionProps {
  vesselType: VesselType;
  isLoading?: boolean;
}

const PortCongestionSection: React.FC<PortCongestionSectionProps> = ({ 
  vesselType,
  isLoading = false 
}) => {
  const ports = generateMockPorts(vesselType);
  
  const columns = [
    { 
      header: 'Port', 
      accessor: 'name',
      className: 'font-medium' 
    },
    { 
      header: 'Congestion Level',
      accessor: (port: Port) => {
        // Render congestion level as a visual indicator
        const level = port.congestionLevel;
        const bgColor = level > 6 ? 'bg-red-500' : level > 4 ? 'bg-yellow-500' : 'bg-green-500';
        
        return (
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className={`${bgColor} h-2 rounded-full`} 
                style={{ width: `${(level / 10) * 100}%` }}
              ></div>
            </div>
            <span className="font-mono">{level.toFixed(1)}/10</span>
          </div>
        );
      },
    },
    { 
      header: 'Weekly Change', 
      accessor: (port: Port) => renderChangeCell(port.weeklyChange),
    },
    { 
      header: 'Monthly Change', 
      accessor: (port: Port) => renderChangeCell(port.monthlyChange),
    }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <div className="flex items-center mb-4">
        <Anchor className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-medium text-gray-800">Port Congestion Levels</h3>
      </div>
      
      <DataTable 
        columns={columns}
        data={ports}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PortCongestionSection;