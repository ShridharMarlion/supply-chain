import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw,
  BarChart3,
  Activity,
  DollarSign,
  Package,
  Users,
  Truck,
  AlertTriangle,
  Target,
  Clock,
  Globe,
  FileText,
  Eye,
  Share2
} from 'lucide-react';

// Types
interface ChartData {
  date: string;
  procurement: number;
  logistics: number;
  risk: number;
  overall: number;
  cost: number;
  orders: number;
}

interface SupplierData {
  name: string;
  performance: number;
  reliability: number;
  cost: number;
  orders: number;
}

interface RegionalData {
  region: string;
  performance: number;
  orders: number;
  suppliers: number;
  color: string;
}

interface KpiTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  data: Array<{ period: string; value: number }>;
}

// Mock Data
const performanceData: ChartData[] = [
  { date: '2024-01', procurement: 85, logistics: 78, risk: 92, overall: 85, cost: 2.1, orders: 1150 },
  { date: '2024-02', procurement: 88, logistics: 82, risk: 89, overall: 86, cost: 2.3, orders: 1200 },
  { date: '2024-03', procurement: 91, logistics: 85, risk: 94, overall: 90, cost: 2.0, orders: 1280 },
  { date: '2024-04', procurement: 87, logistics: 79, risk: 91, overall: 86, cost: 2.4, orders: 1190 },
  { date: '2024-05', procurement: 93, logistics: 88, risk: 96, overall: 92, cost: 1.9, orders: 1340 },
  { date: '2024-06', procurement: 90, logistics: 84, risk: 93, overall: 89, cost: 2.2, orders: 1270 },
  { date: '2024-07', procurement: 95, logistics: 91, risk: 97, overall: 94, cost: 1.8, orders: 1420 }
];

const supplierData: SupplierData[] = [
  { name: 'TechCorp Ltd', performance: 96, reliability: 94, cost: 2.1, orders: 145 },
  { name: 'Global Supplies', performance: 89, reliability: 87, cost: 1.8, orders: 232 },
  { name: 'InnovateParts', performance: 92, reliability: 95, cost: 2.3, orders: 178 },
  { name: 'QuickLogistics', performance: 85, reliability: 82, cost: 1.6, orders: 201 },
  { name: 'ReliableGoods', performance: 94, reliability: 96, cost: 2.0, orders: 156 }
];

const regionalData: RegionalData[] = [
  { region: 'North America', performance: 94, orders: 450, suppliers: 85, color: '#3b82f6' },
  { region: 'Europe', performance: 89, orders: 380, suppliers: 72, color: '#10b981' },
  { region: 'Asia Pacific', performance: 92, orders: 520, suppliers: 96, color: '#f59e0b' },
  { region: 'Latin America', performance: 86, orders: 210, suppliers: 34, color: '#ef4444' },
  { region: 'Middle East & Africa', performance: 88, orders: 180, suppliers: 28, color: '#8b5cf6' }
];

const kpiTrends: KpiTrend[] = [
  {
    metric: 'Overall Performance',
    current: 94.7,
    previous: 92.3,
    change: 2.4,
    trend: 'up',
    data: [
      { period: 'Jan', value: 85 },
      { period: 'Feb', value: 86 },
      { period: 'Mar', value: 90 },
      { period: 'Apr', value: 86 },
      { period: 'May', value: 92 },
      { period: 'Jun', value: 89 },
      { period: 'Jul', value: 94.7 }
    ]
  },
  {
    metric: 'Cost Efficiency',
    current: 87.2,
    previous: 84.8,
    change: 2.4,
    trend: 'up',
    data: [
      { period: 'Jan', value: 79 },
      { period: 'Feb', value: 81 },
      { period: 'Mar', value: 85 },
      { period: 'Apr', value: 82 },
      { period: 'May', value: 86 },
      { period: 'Jun', value: 84 },
      { period: 'Jul', value: 87.2 }
    ]
  },
  {
    metric: 'Order Fulfillment',
    current: 98.2,
    previous: 96.8,
    change: 1.4,
    trend: 'up',
    data: [
      { period: 'Jan', value: 94 },
      { period: 'Feb', value: 95 },
      { period: 'Mar', value: 97 },
      { period: 'Apr', value: 95 },
      { period: 'May', value: 98 },
      { period: 'Jun', value: 97 },
      { period: 'Jul', value: 98.2 }
    ]
  },
  {
    metric: 'Risk Score',
    current: 23,
    previous: 27,
    change: -14.8,
    trend: 'down',
    data: [
      { period: 'Jan', value: 35 },
      { period: 'Feb', value: 32 },
      { period: 'Mar', value: 28 },
      { period: 'Apr', value: 31 },
      { period: 'May', value: 25 },
      { period: 'Jun', value: 27 },
      { period: 'Jul', value: 23 }
    ]
  }
];

// Components
const MetricCard: React.FC<{ trend: KpiTrend }> = ({ trend }) => {
  const isPositive = trend.trend === 'up' && trend.metric !== 'Risk Score' || trend.trend === 'down' && trend.metric === 'Risk Score';
  
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{trend.metric}</h3>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-medium">{Math.abs(trend.change)}%</span>
        </div>
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-4">
        {trend.metric === 'Risk Score' ? trend.current : `${trend.current}%`}
      </div>
      
      <div className="h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#10b981" : "#ef4444"} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ChartContainer: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  actions?: React.ReactNode;
  description?: string;
}> = ({ title, children, actions, description }) => (
  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </div>
);

const ReportCard: React.FC<{ 
  title: string; 
  description: string; 
  lastGenerated: string; 
  onGenerate: () => void;
  onView: () => void;
}> = ({ title, description, lastGenerated, onGenerate, onView }) => (
  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
    
    <div className="text-xs text-gray-500 mb-4">
      Last generated: {lastGenerated}
    </div>
    
    <div className="flex gap-2">
      <button 
        onClick={onView}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        <Eye size={14} />
        View
      </button>
      <button 
        onClick={onGenerate}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
      >
        <RefreshCw size={14} />
        Generate
      </button>
    </div>
  </div>
);

const AnalyticsReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedChart, setSelectedChart] = useState('performance');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Simulate export functionality
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Analytics & Reports
            </h1>
            <p className="text-gray-600">
              Comprehensive insights and data visualization for supply chain performance
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Trends */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={24} />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiTrends.map(trend => (
            <MetricCard key={trend.metric} trend={trend} />
          ))}
        </div>
      </div>

      {/* Chart Selection Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'performance', label: 'Performance Trends', icon: Activity },
            { id: 'suppliers', label: 'Supplier Analysis', icon: Users },
            { id: 'regional', label: 'Regional Performance', icon: Globe },
            { id: 'costs', label: 'Cost Analysis', icon: DollarSign }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedChart(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChart === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {selectedChart === 'performance' && (
          <>
            <ChartContainer 
              title="Performance Trends" 
              description="Agent performance over time"
              actions={
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Share2 size={16} />
                </button>
              }
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="procurement" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Procurement"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="logistics" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Logistics"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Risk Management"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            <ChartContainer title="Order Volume Trends">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.3}
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </>
        )}

        {selectedChart === 'suppliers' && (
          <>
            <ChartContainer title="Supplier Performance Comparison">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplierData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                    <Bar dataKey="reliability" fill="#10b981" name="Reliability %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            <ChartContainer title="Supplier Order Distribution">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={supplierData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="orders"
                      label={(entry) => entry.name}
                    >
                      {supplierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </>
        )}

        {selectedChart === 'regional' && (
          <>
            <ChartContainer title="Regional Performance">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="region" type="category" stroke="#666" width={120} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            <ChartContainer title="Regional Order Volume">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionalData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="orders"
                      label={(entry) => `${entry.region}: ${entry.orders}`}
                    >
                      {regionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </>
        )}

        {selectedChart === 'costs' && (
          <>
            <ChartContainer title="Cost Optimization Trends">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Cost ($M)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            <ChartContainer title="Cost Breakdown by Category">
              <div className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Cost breakdown chart</p>
                  <p className="text-sm">(Would show procurement vs logistics vs operations costs)</p>
                </div>
              </div>
            </ChartContainer>
          </>
        )}
      </div>

      {/* Automated Reports */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={24} />
          Automated Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard
            title="Executive Summary"
            description="Weekly performance overview for leadership"
            lastGenerated="2 hours ago"
            onGenerate={() => alert('Generating executive summary...')}
            onView={() => alert('Opening executive summary...')}
          />
          
          <ReportCard
            title="Supplier Performance Report"
            description="Detailed analysis of supplier metrics and KPIs"
            lastGenerated="1 day ago"
            onGenerate={() => alert('Generating supplier report...')}
            onView={() => alert('Opening supplier report...')}
          />
          
          <ReportCard
            title="Risk Assessment Report"
            description="Current risk factors and mitigation strategies"
            lastGenerated="3 hours ago"
            onGenerate={() => alert('Generating risk report...')}
            onView={() => alert('Opening risk report...')}
          />
          
          <ReportCard
            title="Cost Analysis Report"
            description="Detailed cost breakdown and optimization opportunities"
            lastGenerated="6 hours ago"
            onGenerate={() => alert('Generating cost analysis...')}
            onView={() => alert('Opening cost analysis...')}
          />
          
          <ReportCard
            title="Operational Efficiency Report"
            description="Process efficiency metrics and improvement recommendations"
            lastGenerated="12 hours ago"
            onGenerate={() => alert('Generating efficiency report...')}
            onView={() => alert('Opening efficiency report...')}
          />
          
          <ReportCard
            title="Compliance Report"
            description="Regulatory compliance status and audit trail"
            lastGenerated="1 day ago"
            onGenerate={() => alert('Generating compliance report...')}
            onView={() => alert('Opening compliance report...')}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;