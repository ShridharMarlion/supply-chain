import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Navigation,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Signal,
  Battery,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Building,
  Users,
  Calendar,
  BarChart3,
  Target,
  Shield,
  Info
} from 'lucide-react';

// Types
interface Shipment {
  id: string;
  orderId: string;
  status: 'in_transit' | 'delivered' | 'delayed' | 'pending' | 'exception';
  priority: 'high' | 'medium' | 'low';
  origin: Location;
  destination: Location;
  currentLocation: Location;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  carrier: string;
  trackingNumber: string;
  items: ShipmentItem[];
  route: RoutePoint[];
  temperature?: number;
  humidity?: number;
  lastUpdate: Date;
}

interface Location {
  name: string;
  address: string;
  coordinates: [number, number];
  city: string;
  country: string;
}

interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
  weight: number;
  category: string;
}

interface RoutePoint {
  location: Location;
  timestamp: Date;
  status: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  location: Location;
  status: 'active' | 'inactive' | 'issues';
  performance: number;
  reliability: number;
  activeOrders: number;
  totalValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastDelivery: Date;
  contracts: number;
}

interface IoTSensor {
  id: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'vibration' | 'gps' | 'shock';
  location: string;
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  batteryLevel: number;
  lastReading: Date;
  thresholds: {
    min: number;
    max: number;
    warning: number;
  };
}

// Mock Data
const mockShipments: Shipment[] = [
  {
    id: 'SHP-001',
    orderId: 'ORD-12345',
    status: 'in_transit',
    priority: 'high',
    origin: {
      name: 'Mumbai Distribution Center',
      address: '123 Industrial Area, Mumbai',
      coordinates: [72.8777, 19.0760],
      city: 'Mumbai',
      country: 'India'
    },
    destination: {
      name: 'Chennai Warehouse',
      address: '456 Port Road, Chennai',
      coordinates: [80.2707, 13.0827],
      city: 'Chennai',
      country: 'India'
    },
    currentLocation: {
      name: 'Highway Checkpoint',
      address: 'NH-4, Near Pune',
      coordinates: [73.8567, 18.5204],
      city: 'Pune',
      country: 'India'
    },
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    carrier: 'FastTrack Logistics',
    trackingNumber: 'FT123456789',
    items: [
      { id: '1', name: 'Electronic Components', quantity: 500, value: 75000, weight: 250, category: 'Electronics' },
      { id: '2', name: 'Packaging Materials', quantity: 100, value: 15000, weight: 80, category: 'Materials' }
    ],
    route: [],
    temperature: 24.5,
    humidity: 65,
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 'SHP-002',
    orderId: 'ORD-12346',
    status: 'delayed',
    priority: 'medium',
    origin: {
      name: 'Delhi Hub',
      address: '789 Logistics Park, Delhi',
      coordinates: [77.1025, 28.7041],
      city: 'Delhi',
      country: 'India'
    },
    destination: {
      name: 'Bangalore Center',
      address: '321 Tech Park, Bangalore',
      coordinates: [77.5946, 12.9716],
      city: 'Bangalore',
      country: 'India'
    },
    currentLocation: {
      name: 'Hyderabad Junction',
      address: 'Transport Hub, Hyderabad',
      coordinates: [78.4867, 17.3850],
      city: 'Hyderabad',
      country: 'India'
    },
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
    carrier: 'QuickMove Express',
    trackingNumber: 'QM987654321',
    items: [
      { id: '3', name: 'Software Licenses', quantity: 50, value: 120000, weight: 5, category: 'Software' }
    ],
    route: [],
    temperature: 28.2,
    humidity: 72,
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 'SHP-003',
    orderId: 'ORD-12347',
    status: 'delivered',
    priority: 'low',
    origin: {
      name: 'Kolkata Port',
      address: 'Port Area, Kolkata',
      coordinates: [88.3639, 22.5726],
      city: 'Kolkata',
      country: 'India'
    },
    destination: {
      name: 'Guwahati Distribution',
      address: 'Industrial Zone, Guwahati',
      coordinates: [91.7898, 26.1445],
      city: 'Guwahati',
      country: 'India'
    },
    currentLocation: {
      name: 'Guwahati Distribution',
      address: 'Industrial Zone, Guwahati',
      coordinates: [91.7898, 26.1445],
      city: 'Guwahati',
      country: 'India'
    },
    estimatedDelivery: new Date(Date.now() - 3 * 60 * 60 * 1000),
    actualDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000),
    carrier: 'Regional Transport',
    trackingNumber: 'RT456789123',
    items: [
      { id: '4', name: 'Raw Materials', quantity: 1000, value: 45000, weight: 500, category: 'Materials' }
    ],
    route: [],
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'TechCorp Manufacturing',
    location: {
      name: 'TechCorp Facility',
      address: 'Industrial Estate, Pune',
      coordinates: [73.8567, 18.5204],
      city: 'Pune',
      country: 'India'
    },
    status: 'active',
    performance: 94,
    reliability: 96,
    activeOrders: 15,
    totalValue: 2500000,
    riskLevel: 'low',
    lastDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    contracts: 8
  },
  {
    id: 'SUP-002',
    name: 'Global Components Ltd',
    location: {
      name: 'Global Components Factory',
      address: 'Export Zone, Chennai',
      coordinates: [80.2707, 13.0827],
      city: 'Chennai',
      country: 'India'
    },
    status: 'issues',
    performance: 78,
    reliability: 82,
    activeOrders: 8,
    totalValue: 1800000,
    riskLevel: 'medium',
    lastDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    contracts: 5
  },
  {
    id: 'SUP-003',
    name: 'Reliable Parts Inc',
    location: {
      name: 'Reliable Parts Warehouse',
      address: 'Manufacturing Hub, Mumbai',
      coordinates: [72.8777, 19.0760],
      city: 'Mumbai',
      country: 'India'
    },
    status: 'active',
    performance: 88,
    reliability: 91,
    activeOrders: 12,
    totalValue: 3200000,
    riskLevel: 'low',
    lastDelivery: new Date(Date.now() - 24 * 60 * 60 * 1000),
    contracts: 12
  }
];

const mockSensors: IoTSensor[] = [
  {
    id: 'TEMP-001',
    type: 'temperature',
    location: 'Shipment SHP-001',
    value: 24.5,
    unit: '°C',
    status: 'online',
    batteryLevel: 85,
    lastReading: new Date(Date.now() - 5 * 60 * 1000),
    thresholds: { min: 15, max: 30, warning: 28 }
  },
  {
    id: 'HUM-001',
    type: 'humidity',
    location: 'Shipment SHP-001',
    value: 65,
    unit: '%',
    status: 'online',
    batteryLevel: 85,
    lastReading: new Date(Date.now() - 5 * 60 * 1000),
    thresholds: { min: 40, max: 80, warning: 75 }
  },
  {
    id: 'GPS-001',
    type: 'gps',
    location: 'Shipment SHP-002',
    value: 0,
    unit: '',
    status: 'warning',
    batteryLevel: 23,
    lastReading: new Date(Date.now() - 45 * 60 * 1000),
    thresholds: { min: 0, max: 100, warning: 30 }
  },
  {
    id: 'TEMP-002',
    type: 'temperature',
    location: 'Warehouse Chennai',
    value: 22.1,
    unit: '°C',
    status: 'online',
    batteryLevel: 92,
    lastReading: new Date(Date.now() - 2 * 60 * 1000),
    thresholds: { min: 18, max: 25, warning: 24 }
  }
];

// Components
const StatusBadge: React.FC<{ status: string; type?: 'shipment' | 'supplier' | 'sensor' }> = ({ 
  status, 
  type = 'shipment' 
}) => {
  const getStatusConfig = () => {
    if (type === 'shipment') {
      const configs = {
        in_transit: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Truck },
        delivered: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
        delayed: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
        pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
        exception: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
      };
      return configs[status as keyof typeof configs] || configs.pending;
    } else if (type === 'supplier') {
      const configs = {
        active: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
        inactive: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
        issues: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle }
      };
      return configs[status as keyof typeof configs] || configs.inactive;
    } else {
      const configs = {
        online: { color: 'bg-green-100 text-green-700 border-green-200', icon: Wifi },
        offline: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: WifiOff },
        warning: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle },
        error: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
      };
      return configs[status as keyof typeof configs] || configs.offline;
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <IconComponent size={12} />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

const ShipmentCard: React.FC<{ shipment: Shipment; onView: () => void }> = ({ shipment, onView }) => {
  const totalValue = shipment.items.reduce((sum, item) => sum + item.value, 0);
  const totalWeight = shipment.items.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{shipment.id}</h3>
          <p className="text-sm text-gray-600">{shipment.trackingNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={shipment.status} type="shipment" />
          <button 
            onClick={onView}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-gray-500" />
          <span className="text-gray-600">From:</span>
          <span className="font-medium">{shipment.origin.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Navigation size={14} className="text-gray-500" />
          <span className="text-gray-600">To:</span>
          <span className="font-medium">{shipment.destination.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck size={14} className="text-gray-500" />
          <span className="text-gray-600">Carrier:</span>
          <span className="font-medium">{shipment.carrier}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Total Value</p>
          <p className="font-semibold">₹{totalValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Weight</p>
          <p className="font-semibold">{totalWeight} kg</p>
        </div>
      </div>

      {(shipment.temperature || shipment.humidity) && (
        <div className="flex items-center gap-4 mb-4 p-2 bg-gray-50 rounded-lg">
          {shipment.temperature && (
            <div className="flex items-center gap-1 text-sm">
              <Thermometer size={14} className="text-blue-500" />
              <span>{shipment.temperature}°C</span>
            </div>
          )}
          {shipment.humidity && (
            <div className="flex items-center gap-1 text-sm">
              <Droplets size={14} className="text-blue-500" />
              <span>{shipment.humidity}%</span>
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">ETA:</span>
          <span className="font-medium">
            {shipment.estimatedDelivery.toLocaleDateString()}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Updated: {shipment.lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

const SupplierCard: React.FC<{ supplier: Supplier; onView: () => void }> = ({ supplier, onView }) => {
  const getRiskColor = (level: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
          <p className="text-sm text-gray-600">{supplier.location.city}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={supplier.status} type="supplier" />
          <button 
            onClick={onView}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Performance</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${supplier.performance}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{supplier.performance}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-600">Reliability</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${supplier.reliability}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{supplier.reliability}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Active Orders</p>
          <p className="font-semibold">{supplier.activeOrders}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Total Value</p>
          <p className="font-semibold">₹{(supplier.totalValue / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-3">
        <div className="flex items-center gap-1">
          <Shield size={14} className={getRiskColor(supplier.riskLevel)} />
          <span className={`text-sm font-medium ${getRiskColor(supplier.riskLevel)}`}>
            {supplier.riskLevel.toUpperCase()} RISK
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Last delivery: {supplier.lastDelivery.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const SensorCard: React.FC<{ sensor: IoTSensor }> = ({ sensor }) => {
  const getSensorIcon = (type: string) => {
    const icons = {
      temperature: Thermometer,
      humidity: Droplets,
      pressure: Wind,
      vibration: Activity,
      gps: MapPin,
      shock: Zap
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const isInWarning = sensor.value > sensor.thresholds.warning || sensor.value < sensor.thresholds.min;
  const IconComponent = getSensorIcon(sensor.type);

  return (
    <div className={`bg-white rounded-xl border-2 shadow-lg p-4 ${
      isInWarning ? 'border-yellow-200' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent size={16} className="text-blue-600" />
          <span className="font-medium text-sm capitalize">{sensor.type}</span>
        </div>
        <StatusBadge status={sensor.status} type="sensor" />
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900">
          {sensor.value}{sensor.unit}
        </div>
        <div className="text-xs text-gray-600">{sensor.location}</div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Battery size={12} />
          <span>{sensor.batteryLevel}%</span>
        </div>
        <div>{sensor.lastReading.toLocaleTimeString()}</div>
      </div>

      {isInWarning && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700 flex items-center gap-1">
          <AlertTriangle size={12} />
          Value outside normal range
        </div>
      )}
    </div>
  );
};

const SupplyChainMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shipments');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs = [
    { id: 'shipments', label: 'Shipments', icon: Truck, count: mockShipments.length },
    { id: 'suppliers', label: 'Suppliers', icon: Building, count: mockSuppliers.length },
    { id: 'sensors', label: 'IoT Sensors', icon: Activity, count: mockSensors.length },
    { id: 'map', label: 'Live Map', icon: Globe, count: 0 }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredShipments = mockShipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || shipment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || supplier.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredSensors = mockSensors.filter(sensor => {
    const matchesSearch = sensor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sensor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sensor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🚛 Supply Chain Monitoring
            </h1>
            <p className="text-gray-600">
              Real-time tracking and monitoring of shipments, suppliers, and IoT sensors
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex gap-3">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck size={20} className="text-blue-600" />
            </div>
            <span className="font-semibold text-gray-800">Active Shipments</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{mockShipments.filter(s => s.status === 'in_transit').length}</div>
          <div className="text-sm text-gray-600">
            {mockShipments.filter(s => s.status === 'delayed').length} delayed
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building size={20} className="text-green-600" />
            </div>
            <span className="font-semibold text-gray-800">Active Suppliers</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{mockSuppliers.filter(s => s.status === 'active').length}</div>
          <div className="text-sm text-gray-600">
            {mockSuppliers.filter(s => s.status === 'issues').length} with issues
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity size={20} className="text-purple-600" />
            </div>
            <span className="font-semibold text-gray-800">IoT Sensors</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{mockSensors.filter(s => s.status === 'online').length}</div>
          <div className="text-sm text-gray-600">
            {mockSensors.filter(s => s.status === 'warning' || s.status === 'error').length} alerts
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target size={20} className="text-orange-600" />
            </div>
            <span className="font-semibold text-gray-800">On-Time Delivery</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">94.2%</div>
          <div className="text-sm text-green-600">+2.1% this week</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={16} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      {activeTab !== 'map' && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {activeTab === 'shipments' && (
                <>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                  <option value="pending">Pending</option>
                  <option value="exception">Exception</option>
                </>
              )}
              {activeTab === 'suppliers' && (
                <>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="issues">Issues</option>
                </>
              )}
              {activeTab === 'sensors' && (
                <>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </>
              )}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {activeTab === 'shipments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShipments.map(shipment => (
              <ShipmentCard 
                key={shipment.id} 
                shipment={shipment} 
                onView={() => alert(`View details for ${shipment.id}`)}
              />
            ))}
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <SupplierCard 
                key={supplier.id} 
                supplier={supplier} 
                onView={() => alert(`View details for ${supplier.name}`)}
              />
            ))}
          </div>
        )}

        {activeTab === 'sensors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSensors.map(sensor => (
              <SensorCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Globe size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Interactive Supply Chain Map</h3>
                <p className="mb-2">Real-time visualization of:</p>
                <ul className="text-sm space-y-1">
                  <li>• Shipment locations and routes</li>
                  <li>• Supplier facilities and status</li>
                  <li>• Warehouse and distribution centers</li>
                  <li>• IoT sensor locations</li>
                  <li>• Traffic and weather conditions</li>
                </ul>
                <p className="text-sm mt-4 text-blue-600">
                  Integration ready for Google Maps, Mapbox, or OpenStreetMap
                </p>
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors">
                Show All Shipments
              </button>
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors">
                Active Suppliers
              </button>
              <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium hover:bg-purple-200 transition-colors">
                IoT Sensors
              </button>
              <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium hover:bg-orange-200 transition-colors">
                Weather Layer
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors">
                Risk Zones
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty States */}
      {activeTab === 'shipments' && filteredShipments.length === 0 && (
        <div className="text-center py-12">
          <Truck size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No shipments found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {activeTab === 'suppliers' && filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Building size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No suppliers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {activeTab === 'sensors' && filteredSensors.length === 0 && (
        <div className="text-center py-12">
          <Activity size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No sensors found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default SupplyChainMonitoring;