export type VesselType = 'Dry Bulk' | 'Tanker';

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  previousValue: number;
  weeklyChange: number;
  monthlyChange: number;
  historicalData: HistoricalDataPoint[];
  description: string;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  spotRate: number;
  previousSpotRate: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface Region {
  id: string;
  name: string;
  vesselCount: number;
  previousVesselCount: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface Port {
  id: string;
  name: string;
  congestionLevel: number;
  previousCongestionLevel: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface BunkerPrice {
  id: string;
  location: string;
  price: number;
  previousPrice: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface TonnageSupply {
  id: string;
  vesselType: VesselType;
  supply: number;
  previousSupply: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface CargoOrder {
  id: string;
  cargoType: string;
  volume: number;
  previousVolume: number;
  weeklyChange: number;
  monthlyChange: number;
}

export interface SQLQuery {
  name: string;
  description: string;
  query: string;
}