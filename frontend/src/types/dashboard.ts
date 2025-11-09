// src/types/dashboard.ts
export interface ForecastData {
  name: string;
  value: number;
}
export interface StationStatus {
  critical: number;
  warning: number;
  normal: number;
}
export interface AlertLog {
  id: string;
  timestamp: string;
  station: string;
  level: string;
  message: string;
}
export interface LiveStationData {
  STN_ID: string;
  STN_Name: string;
  CURR_Water_D_Level_MSL: string;
  CURR_FLOW: string;
  CURR_Acc_Rain_15_M: string;
  LAST_UPDATE: string;
}
export interface MergedStation {
  id: string;
  STN_ID: string;
  name: string;
  position: { lat: number; lng: number };
  zeroLevel: number;
  isSource?: boolean;
  isDestination?: boolean;
  status: 'critical' | 'warning' | 'normal';
  waterLevel: number;
  flowRate: number;
  rainfall: number;
  lastUpdate: string;
}
export interface ApiHistoryData {
  datetime: string;
  water_level: string;
  flowRate: string;
  rainfall: string;
}
export interface ChartDataPoint {
  timestamp: number;
  level_nawang?: number;
  level_mengrai?: number;
  level?: number;
}
export interface GraphState {
  visible: boolean;
  data: ChartDataPoint[];
  title: string;
}