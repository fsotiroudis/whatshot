import React from 'react';
import { Fuel, ShipIcon, Package } from 'lucide-react';
import MetricCard from './MetricCard';
import { 
  VesselType, 
  BunkerPrice, 
  TonnageSupply,
  CargoOrder
} from '../types';
import { 
  generateMockBunkerPrices, 
  generateMockTonnageSupply,
  generateMockCargoOrders
} from '../utils/dataUtils';

interface KeyMetricsSectionProps {
  vesselType: VesselType;
  isLoading?: boolean;
}

const KeyMetricsSection: React.FC<KeyMetricsSectionProps> = ({ 
  vesselType,
  isLoading = false
}) => {
  // Generate data
  const bunkerPrices: BunkerPrice[] = generateMockBunkerPrices();
  const tonnageSupply: TonnageSupply = generateMockTonnageSupply(vesselType);
  const cargoOrders: CargoOrder[] = generateMockCargoOrders(vesselType);
  
  // Calculate average bunker price
  const avgBunkerPrice = bunkerPrices.reduce((sum, item) => sum + item.price, 0) / bunkerPrices.length;
  const avgBunkerPriceChange = bunkerPrices.reduce((sum, item) => sum + item.weeklyChange, 0) / bunkerPrices.length;
  const avgBunkerPriceMonthlyChange = bunkerPrices.reduce((sum, item) => sum + item.monthlyChange, 0) / bunkerPrices.length;
  
  // Calculate total cargo volume
  const totalCargoVolume = cargoOrders.reduce((sum, item) => sum + item.volume, 0);
  const totalPreviousCargoVolume = cargoOrders.reduce((sum, item) => sum + item.previousVolume, 0);
  const cargoVolumeChange = ((totalCargoVolume - totalPreviousCargoVolume) / totalPreviousCargoVolume) * 100;
  
  // Calculate weighted monthly change for cargo
  const weightedMonthlyChange = cargoOrders.reduce((sum, item) => sum + (item.monthlyChange * (item.volume / totalCargoVolume)), 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        title="Average Bunker Price"
        value={avgBunkerPrice}
        unit="$/mt"
        weeklyChange={avgBunkerPriceChange}
        monthlyChange={avgBunkerPriceMonthlyChange}
        icon={<Fuel size={20} />}
        isLoading={isLoading}
      />
      
      <MetricCard 
        title={`${vesselType} Tonnage Supply`}
        value={tonnageSupply.supply}
        unit="million DWT"
        weeklyChange={tonnageSupply.weeklyChange}
        monthlyChange={tonnageSupply.monthlyChange}
        icon={<ShipIcon size={20} />}
        isLoading={isLoading}
      />
      
      <MetricCard 
        title="Cargo Order Book"
        value={totalCargoVolume}
        unit="million tonnes"
        weeklyChange={cargoVolumeChange}
        monthlyChange={weightedMonthlyChange}
        icon={<Package size={20} />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default KeyMetricsSection;