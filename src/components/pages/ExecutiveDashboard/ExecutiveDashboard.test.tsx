import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

 const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};



// Components
const KpiCard: React.FC<{ metric: KpiMetric; index: number }> = ({ metric, index }) => {
  const IconComponent = TrendingUp;
  
  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary-50 border-primary-200 text-primary-700',
      success: 'bg-success-50 border-success-200 text-success-700',
      warning: 'bg-warning-50 border-warning-200 text-warning-700',
      danger: 'bg-danger-50 border-danger-200 text-danger-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  const getIconBgColor = (color: string) => {
    const colorMap = {
      primary: 'bg-primary-100',
      success: 'bg-success-100',
      warning: 'bg-warning-100',
      danger: 'bg-danger-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`
        p-6 rounded-xl border-2 bg-white shadow-soft hover:shadow-medium 
        transition-all duration-300 cursor-pointer
        ${getColorClasses(metric.color)}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${getIconBgColor(metric.color)}`}>
              <IconComponent size={20} className="text-current" />
            </div>
            <h3 className="font-semibold text-secondary-800 text-sm">
              {metric.title}
            </h3>
          </div>
          
          <div className="mb-2">
            <span className="text-3xl font-bold text-secondary-900">
              {metric.value}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            {metric.changeType === 'increase' ? (
              <TrendingUp size={16} className="text-success-600" />
            ) : metric.changeType === 'decrease' ? (
              <TrendingDown size={16} className="text-danger-600" />
            ) : (
              <Activity size={16} className="text-secondary-500" />
            )}
            <span className={`text-sm font-medium ${
              metric.changeType === 'increase' ? 'text-success-600' : 
              metric.changeType === 'decrease' ? 'text-danger-600' : 
              'text-secondary-500'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
            <span className="text-sm text-secondary-600">vs last month</span>
          </div>
          
          <p className="text-sm text-secondary-600">
            {metric.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const AgentStatusCard: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  const getStatusColor = (status: string) => {
    const statusMap = {
      active: 'bg-success-100 text-success-700 border-success-200',
      processing: 'bg-warning-100 text-warning-700 border-warning-200',
      idle: 'bg-secondary-100 text-secondary-700 border-secondary-200'
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
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="p-5 bg-white rounded-xl border-2 border-secondary-200 shadow-soft hover:shadow-medium transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-secondary-800">{agent.name}</h4>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-2 ${getStatusColor(agent.status)}`}>
          {getStatusIcon(agent.status)}
          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-secondary-600 mb-1">Actions Today</p>
          <p className="text-lg font-bold text-secondary-900">{agent.actionsToday}</p>
        </div>
        <div>
          <p className="text-xs text-secondary-600 mb-1">Success Rate</p>
          <p className="text-lg font-bold text-success-600">{agent.successRate}%</p>
        </div>
      </div>
    </motion.div>
  );
};

const ExecutiveDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Executive Dashboard
            </h1>
            <p className="text-secondary-600">
              Real-time supply chain intelligence powered by AI agents
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <div className="bg-white px-4 py-2 rounded-lg border border-secondary-200 shadow-soft">
              <p className="text-sm text-secondary-600">Last Updated</p>
              <p className="font-semibold text-secondary-900">
                {currentTime.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Metrics Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {kpiMetrics.map((metric, index) => (
          <KpiCard key={metric.id} metric={metric} index={index} />
        ))}
      </motion.div>

      {/* AI Agents Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Zap size={24} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900">
            AI Agent Status
          </h2>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {agentStatuses.map((agent, index) => (
            <AgentStatusCard key={agent.name} agent={agent} />
          ))}
        </motion.div>
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl border-2 border-secondary-200 shadow-soft p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShoppingCart size={24} className="text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">1,247</p>
            <p className="text-sm text-secondary-600">Active Orders</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Truck size={24} className="text-success-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">189</p>
            <p className="text-sm text-secondary-600">In Transit</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Users size={24} className="text-warning-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">342</p>
            <p className="text-sm text-secondary-600">Active Suppliers</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Shield size={24} className="text-danger-600" />
            </div>
            <p className="text-2xl font-bold text-secondary-900">7</p>
            <p className="text-sm text-secondary-600">Critical Alerts</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutiveDashboard;