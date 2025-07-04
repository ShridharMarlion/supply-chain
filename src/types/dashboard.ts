export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  description: string;
  trend: number[];
  color: 'primary' | 'success' | 'warning' | 'danger';
  target?: number;
  unit?: string;
}

export interface AgentActivity {
  agentId: string;
  agentName: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastAction: string;
  actionsToday: number;
  successRate: number;
  averageResponseTime: number;
  timestamp: Date;
}

export interface SupplyChainAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'procurement' | 'logistics' | 'risk' | 'quality';
  timestamp: Date;
  status: 'active' | 'resolved' | 'acknowledged';
  affectedRegions?: string[];
  recommendedActions?: string[];
}

export interface PerformanceData {
  date: string;
  procurement: number;
  logistics: number;
  risk: number;
  overall: number;
}

export interface GeographicData {
  region: string;
  performance: number;
  alerts: number;
  suppliers: number;
  coordinates: [number, number];
}

// src/types/common.ts

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst' | 'viewer';
  department: string;
  permissions: string[];
  lastLogin: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
  requiredPermission?: string;
}