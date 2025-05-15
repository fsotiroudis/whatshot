import { 
  Metric, 
  Route, 
  Region, 
  Port, 
  BunkerPrice, 
  TonnageSupply, 
  CargoOrder, 
  VesselType, 
  SQLQuery 
} from '../types';

// Mock data generator functions
export const generateMockRoutes = (vesselType: VesselType): Route[] => {
  if (vesselType === 'Dry Bulk') {
    return [
      {
        id: '1',
        name: 'Brazil to China',
        origin: 'Santos',
        destination: 'Qingdao',
        spotRate: 18.5,
        previousSpotRate: 16.2,
        weeklyChange: 14.2,
        monthlyChange: 8.7,
      },
      {
        id: '2',
        name: 'Australia to Japan',
        origin: 'Port Hedland',
        destination: 'Yokohama',
        spotRate: 12.3,
        previousSpotRate: 13.1,
        weeklyChange: -6.1,
        monthlyChange: -3.2,
      },
      {
        id: '3',
        name: 'US Gulf to Rotterdam',
        origin: 'New Orleans',
        destination: 'Rotterdam',
        spotRate: 15.7,
        previousSpotRate: 14.5,
        weeklyChange: 8.3,
        monthlyChange: 12.1,
      },
    ];
  } else {
    return [
      {
        id: '1',
        name: 'Arabian Gulf to Far East',
        origin: 'Ras Tanura',
        destination: 'Singapore',
        spotRate: 45.2,
        previousSpotRate: 40.1,
        weeklyChange: 12.7,
        monthlyChange: 15.3,
      },
      {
        id: '2',
        name: 'West Africa to US Gulf',
        origin: 'Lagos',
        destination: 'Houston',
        spotRate: 38.9,
        previousSpotRate: 42.3,
        weeklyChange: -8.0,
        monthlyChange: -5.6,
      },
      {
        id: '3',
        name: 'Baltic to UK Continent',
        origin: 'Primorsk',
        destination: 'Rotterdam',
        spotRate: 32.5,
        previousSpotRate: 30.8,
        weeklyChange: 5.5,
        monthlyChange: 7.2,
      },
    ];
  }
};

export const generateMockRegions = (vesselType: VesselType): Region[] => {
  if (vesselType === 'Dry Bulk') {
    return [
      {
        id: '1',
        name: 'North Pacific',
        vesselCount: 325,
        previousVesselCount: 298,
        weeklyChange: 9.1,
        monthlyChange: 12.5,
      },
      {
        id: '2',
        name: 'South Atlantic',
        vesselCount: 187,
        previousVesselCount: 204,
        weeklyChange: -8.3,
        monthlyChange: -5.2,
      },
      {
        id: '3',
        name: 'Mediterranean',
        vesselCount: 142,
        previousVesselCount: 138,
        weeklyChange: 2.9,
        monthlyChange: 6.8,
      },
    ];
  } else {
    return [
      {
        id: '1',
        name: 'Arabian Gulf',
        vesselCount: 210,
        previousVesselCount: 185,
        weeklyChange: 13.5,
        monthlyChange: 15.2,
      },
      {
        id: '2',
        name: 'US Gulf',
        vesselCount: 135,
        previousVesselCount: 142,
        weeklyChange: -4.9,
        monthlyChange: -2.1,
      },
      {
        id: '3',
        name: 'South East Asia',
        vesselCount: 185,
        previousVesselCount: 173,
        weeklyChange: 6.9,
        monthlyChange: 9.8,
      },
    ];
  }
};

export const generateMockPorts = (vesselType: VesselType): Port[] => {
  if (vesselType === 'Dry Bulk') {
    return [
      {
        id: '1',
        name: 'Qingdao',
        congestionLevel: 7.2,
        previousCongestionLevel: 6.5,
        weeklyChange: 10.8,
        monthlyChange: 15.2,
      },
      {
        id: '2',
        name: 'Santos',
        congestionLevel: 5.8,
        previousCongestionLevel: 6.4,
        weeklyChange: -9.4,
        monthlyChange: -4.2,
      },
      {
        id: '3',
        name: 'Newcastle',
        congestionLevel: 4.2,
        previousCongestionLevel: 4.0,
        weeklyChange: 5.0,
        monthlyChange: 7.8,
      },
    ];
  } else {
    return [
      {
        id: '1',
        name: 'Singapore',
        congestionLevel: 6.5,
        previousCongestionLevel: 5.8,
        weeklyChange: 12.1,
        monthlyChange: 18.3,
      },
      {
        id: '2',
        name: 'Rotterdam',
        congestionLevel: 4.8,
        previousCongestionLevel: 5.3,
        weeklyChange: -9.4,
        monthlyChange: -6.7,
      },
      {
        id: '3',
        name: 'Houston',
        congestionLevel: 5.1,
        previousCongestionLevel: 4.9,
        weeklyChange: 4.1,
        monthlyChange: 8.2,
      },
    ];
  }
};

export const generateMockBunkerPrices = (): BunkerPrice[] => {
  return [
    {
      id: '1',
      location: 'Singapore',
      price: 570,
      previousPrice: 620,
      weeklyChange: -8.1,
      monthlyChange: -12.4,
    },
    {
      id: '2',
      location: 'Rotterdam',
      price: 545,
      previousPrice: 580,
      weeklyChange: -6.0,
      monthlyChange: -9.8,
    },
    {
      id: '3',
      location: 'Fujairah',
      price: 555,
      previousPrice: 590,
      weeklyChange: -5.9,
      monthlyChange: -8.5,
    },
  ];
};

export const generateMockTonnageSupply = (vesselType: VesselType): TonnageSupply => {
  if (vesselType === 'Dry Bulk') {
    return {
      id: '1',
      vesselType: 'Dry Bulk',
      supply: 895.2,
      previousSupply: 878.6,
      weeklyChange: 1.9,
      monthlyChange: 3.8,
    };
  } else {
    return {
      id: '1',
      vesselType: 'Tanker',
      supply: 542.7,
      previousSupply: 535.3,
      weeklyChange: 1.4,
      monthlyChange: 2.6,
    };
  }
};

export const generateMockCargoOrders = (vesselType: VesselType): CargoOrder[] => {
  if (vesselType === 'Dry Bulk') {
    return [
      {
        id: '1',
        cargoType: 'Iron Ore',
        volume: 28.5,
        previousVolume: 25.2,
        weeklyChange: 13.1,
        monthlyChange: 16.8,
      },
      {
        id: '2',
        cargoType: 'Coal',
        volume: 18.7,
        previousVolume: 20.4,
        weeklyChange: -8.3,
        monthlyChange: -5.4,
      },
      {
        id: '3',
        cargoType: 'Grain',
        volume: 12.3,
        previousVolume: 11.8,
        weeklyChange: 4.2,
        monthlyChange: 7.9,
      },
    ];
  } else {
    return [
      {
        id: '1',
        cargoType: 'Crude Oil',
        volume: 32.4,
        previousVolume: 29.7,
        weeklyChange: 9.1,
        monthlyChange: 12.5,
      },
      {
        id: '2',
        cargoType: 'Refined Products',
        volume: 24.8,
        previousVolume: 26.7,
        weeklyChange: -7.1,
        monthlyChange: -4.2,
      },
      {
        id: '3',
        cargoType: 'LNG',
        volume: 15.6,
        previousVolume: 14.9,
        weeklyChange: 4.7,
        monthlyChange: 8.3,
      },
    ];
  }
};

export const generateMockSQLQueries = (vesselType: VesselType): SQLQuery[] => {
  const type = vesselType === 'Dry Bulk' ? 'dry_bulk' : 'tanker';
  
  return [
    {
      name: 'Current Spot Rates',
      description: 'Query to extract current spot rates for major routes',
      query: `
SELECT 
  route_name, 
  origin_port, 
  destination_port, 
  current_rate,
  previous_rate,
  (current_rate - previous_rate) / previous_rate * 100 AS weekly_change_pct
FROM 
  signal_ocean.${type}_spot_rates
WHERE 
  date = CURRENT_DATE
ORDER BY 
  weekly_change_pct DESC;`
    },
    {
      name: 'Vessel Availability',
      description: 'Query to extract vessel availability in key regions',
      query: `
SELECT 
  region_name, 
  COUNT(*) AS vessel_count,
  LAG(COUNT(*), 7) OVER (PARTITION BY region_name ORDER BY date) AS prev_week_count,
  (COUNT(*) - LAG(COUNT(*), 7) OVER (PARTITION BY region_name ORDER BY date)) / 
    LAG(COUNT(*), 7) OVER (PARTITION BY region_name ORDER BY date) * 100 AS weekly_change_pct
FROM 
  signal_ocean.${type}_vessel_positions
WHERE 
  date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
  AND vessel_status = 'available'
GROUP BY 
  region_name, date
ORDER BY 
  date DESC, weekly_change_pct DESC;`
    },
    {
      name: 'Port Congestion Analysis',
      description: 'Query to analyze port congestion levels',
      query: `
SELECT 
  port_name, 
  avg_waiting_time_hours,
  LAG(avg_waiting_time_hours, 7) OVER (PARTITION BY port_name ORDER BY date) AS prev_week_time,
  (avg_waiting_time_hours - LAG(avg_waiting_time_hours, 7) OVER (PARTITION BY port_name ORDER BY date)) / 
    LAG(avg_waiting_time_hours, 7) OVER (PARTITION BY port_name ORDER BY date) * 100 AS weekly_change_pct
FROM 
  signal_ocean.port_congestion
WHERE 
  date BETWEEN CURRENT_DATE - INTERVAL '30 days' AND CURRENT_DATE
  AND vessel_type = '${type}'
GROUP BY 
  port_name, date, avg_waiting_time_hours
ORDER BY 
  date DESC, weekly_change_pct DESC;`
    }
  ];
};

// Function to generate insight text based on metrics
export const generateInsights = (vesselType: VesselType): string[] => {
  const routes = generateMockRoutes(vesselType);
  const regions = generateMockRegions(vesselType);
  const ports = generateMockPorts(vesselType);
  const bunkerPrices = generateMockBunkerPrices();
  const tonnageSupply = generateMockTonnageSupply(vesselType);
  const cargoOrders = generateMockCargoOrders(vesselType);
  
  const insights: string[] = [];
  
  // Check for significant changes in spot rates
  const significantRouteChanges = routes.filter(route => Math.abs(route.weeklyChange) > 10);
  if (significantRouteChanges.length > 0) {
    significantRouteChanges.forEach(route => {
      const direction = route.weeklyChange > 0 ? 'increased' : 'decreased';
      insights.push(`Spot rates for ${route.name} have ${direction} by ${Math.abs(route.weeklyChange).toFixed(1)}% over the past week.`);
    });
  }
  
  // Check for significant changes in vessel availability
  const significantRegionChanges = regions.filter(region => Math.abs(region.weeklyChange) > 10);
  if (significantRegionChanges.length > 0) {
    significantRegionChanges.forEach(region => {
      const direction = region.weeklyChange > 0 ? 'increased' : 'decreased';
      insights.push(`Vessel availability in ${region.name} has ${direction} by ${Math.abs(region.weeklyChange).toFixed(1)}% over the past week.`);
    });
  }
  
  // Check for significant changes in port congestion
  const significantPortChanges = ports.filter(port => Math.abs(port.weeklyChange) > 10);
  if (significantPortChanges.length > 0) {
    significantPortChanges.forEach(port => {
      const direction = port.weeklyChange > 0 ? 'worsened' : 'improved';
      insights.push(`Port congestion at ${port.name} has ${direction} by ${Math.abs(port.weeklyChange).toFixed(1)}% over the past week.`);
    });
  }
  
  // Check for significant changes in bunker prices
  const significantBunkerChanges = bunkerPrices.filter(bunker => Math.abs(bunker.weeklyChange) > 10);
  if (significantBunkerChanges.length > 0) {
    significantBunkerChanges.forEach(bunker => {
      const direction = bunker.weeklyChange > 0 ? 'increased' : 'decreased';
      insights.push(`Bunker prices at ${bunker.location} have ${direction} by ${Math.abs(bunker.weeklyChange).toFixed(1)}% over the past week.`);
    });
  }
  
  // Check for significant changes in cargo orders
  const significantCargoChanges = cargoOrders.filter(cargo => Math.abs(cargo.weeklyChange) > 10);
  if (significantCargoChanges.length > 0) {
    significantCargoChanges.forEach(cargo => {
      const direction = cargo.weeklyChange > 0 ? 'increased' : 'decreased';
      insights.push(`${cargo.cargoType} orders have ${direction} by ${Math.abs(cargo.weeklyChange).toFixed(1)}% over the past week.`);
    });
  }
  
  // Add market summary if we have enough insights
  if (insights.length >= 3) {
    const marketSentiment = 
      routes.reduce((sum, route) => sum + route.weeklyChange, 0) > 0 ? 'positive' : 'negative';
    insights.unshift(`Overall market sentiment for ${vesselType} vessels is ${marketSentiment} this week.`);
  }
  
  return insights;
};

// Function to determine if a metric change is significant (>10%)
export const isSignificantChange = (change: number): boolean => {
  return Math.abs(change) >= 10;
};

// Function to determine color based on change direction and significance
export const getChangeColor = (change: number): string => {
  if (change > 10) return 'text-green-600';
  if (change < -10) return 'text-red-600';
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-gray-500';
};

// Generate historical data for charts
export const generateHistoricalData = (currentValue: number, volatility: number = 0.1): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let value = currentValue;
  
  // Generate data for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation
    const change = value * (Math.random() * volatility * 2 - volatility);
    value = value + change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(value.toFixed(2))
    });
  }
  
  return data;
};