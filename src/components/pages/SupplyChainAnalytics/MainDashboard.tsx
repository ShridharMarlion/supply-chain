import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShoppingCart, 
  Truck, 
  AlertTriangle,
  Users,
  DollarSign,
  Package,
  Globe,
  Zap,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

// Type definitions
interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType;
  description: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

interface AgentStatus {
  name: string;
  status: 'active' | 'processing' | 'idle';
  actionsToday: number;
  successRate: number;
}

// Mock data
const kpiMetrics: KpiMetric[] = [
  {
    id: 'overall-performance',
    title: 'Overall Performance',
    value: '94.7%',
    change: 2.3,
    changeType: 'increase',
    icon: Activity,
    description: 'Supply chain efficiency score',
    color: 'success'
  },
  {
    id: 'cost-savings',
    title: 'Cost Savings',
    value: '$2.4M',
    change: 12.5,
    changeType: 'increase',
    icon: DollarSign,
    description: 'Monthly cost optimization',
    color: 'success'
  },
  {
    id: 'order-fulfillment',
    title: 'Order Fulfillment',
    value: '98.2%',
    change: 1.8,
    changeType: 'increase',
    icon: Package,
    description: 'On-time delivery rate',
    color: 'primary'
  },
  {
    id: 'supplier-performance',
    title: 'Supplier Performance',
    value: '91.5%',
    change: -0.7,
    changeType: 'decrease',
    icon: Users,
    description: 'Average supplier score',
    color: 'warning'
  },
  {
    id: 'risk-alerts',
    title: 'Active Risks',
    value: 23,
    change: -15.2,
    changeType: 'decrease',
    icon: AlertTriangle,
    description: 'Current risk indicators',
    color: 'danger'
  },
  {
    id: 'inventory-turnover',
    title: 'Inventory Turnover',
    value: '8.4x',
    change: 5.1,
    changeType: 'increase',
    icon: Globe,
    description: 'Annual turnover rate',
    color: 'primary'
  }
];

const agentStatuses: AgentStatus[] = [
  {
    name: 'Procurement Agent',
    status: 'active',
    actionsToday: 47,
    successRate: 96.8
  },
  {
    name: 'Logistics Agent',
    status: 'processing',
    actionsToday: 32,
    successRate: 94.2
  },
  {
    name: 'Risk Management Agent',
    status: 'active',
    actionsToday: 28,
    successRate: 98.1
  }
];

// Sub-components
const KpiCard: React.FC<{ metric: KpiMetric; index: number }> = ({ metric, index }) => {
  const IconComponent = TrendingUp;
  
  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-blue-50 border-blue-200 text-blue-700',
      success: 'bg-green-50 border-green-200 text-green-700',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      danger: 'bg-red-50 border-red-200 text-red-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  const getIconBgColor = (color: string) => {
    const colorMap = {
      primary: 'bg-blue-100',
      success: 'bg-green-100',
      warning: 'bg-yellow-100',
      danger: 'bg-red-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div
      className={`
        p-6 rounded-xl border-2 bg-white shadow-lg hover:shadow-xl 
        transition-all duration-300 cursor-pointer transform hover:-translate-y-1
        ${getColorClasses(metric.color)}
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${getIconBgColor(metric.color)}`}>
              <IconComponent size={20} className="text-current" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {metric.title}
            </h3>
          </div>
          
          <div className="mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {metric.value}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {metric.changeType === 'increase' ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : metric.changeType === 'decrease' ? (
              <TrendingDown size={16} className="text-red-600" />
            ) : (
              <Activity size={16} className="text-gray-500" />
            )}
            <span className={`text-sm font-medium ${
              metric.changeType === 'increase' ? 'text-green-600' : 
              metric.changeType === 'decrease' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
            <span className="text-sm text-gray-600">vs last month</span>
          </div>
          
          <p className="text-sm text-gray-600">
            {metric.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const AgentStatusCard: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  const getStatusColor = (status: string) => {
    const statusMap = {
      active: 'bg-green-100 text-green-700 border-green-200',
      processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      idle: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.idle;
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      active: CheckCircle,
      processing: Clock,
      idle: Activity
    };
    const IconComponent = iconMap[status as keyof typeof iconMap] || Activity;
    return <IconComponent size={16} />;
  };

  return (
    <div className="p-5 bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">{agent.name}</h4>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-2 ${getStatusColor(agent.status)}`}>
          {getStatusIcon(agent.status)}
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Actions Today</p>
          <p className="text-lg font-bold text-gray-900">{agent.actionsToday}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
          <p className="text-lg font-bold text-green-600">{agent.successRate}%</p>
        </div>
      </div>
    </div>
  );
};

const DashboardHeader: React.FC<{ currentTime: Date }> = ({ currentTime }) => (
  <div className="mb-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🚀 Supply Chain AI Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Real-time supply chain intelligence powered by AI agents
        </p>
      </div>
      
      <div className="mt-4 lg:mt-0">
        <div className="bg-white px-6 py-3 rounded-lg border border-gray-200 shadow-md">
          <p className="text-sm text-gray-600">Last Updated</p>
          <p className="font-semibold text-gray-900">
            {currentTime.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const QuickStatsBar: React.FC = () => (
  <div 
    className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6"
    style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}
  >
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <ShoppingCart size={24} className="text-blue-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">1,247</p>
        <p className="text-sm text-gray-600">Active Orders</p>
      </div>
      
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-green-100 rounded-full">
            <Truck size={24} className="text-green-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">189</p>
        <p className="text-sm text-gray-600">In Transit</p>
      </div>
      
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Users size={24} className="text-yellow-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">342</p>
        <p className="text-sm text-gray-600">Active Suppliers</p>
      </div>
      
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield size={24} className="text-red-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">7</p>
        <p className="text-sm text-gray-600">Critical Alerts</p>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const MainDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="p-6">
        {/* Header Section */}
        <DashboardHeader currentTime={currentTime} />

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiMetrics.map((metric, index) => (
            <KpiCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>

        {/* AI Agents Status */}
        <div className="mb-8" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap size={28} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI Agent Status
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentStatuses.map((agent, index) => (
              <AgentStatusCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>

        {/* Quick Stats Bar */}
        <QuickStatsBar />
      </div>
    </div>
  );
};

export default MainDashboard;