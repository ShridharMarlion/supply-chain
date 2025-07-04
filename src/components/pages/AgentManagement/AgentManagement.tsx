import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Database,
  Network,
  Eye,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronRight,
  Bot,
  Target,
  BarChart3,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi
} from 'lucide-react';

// Types
interface Agent {
  id: string;
  name: string;
  type: 'procurement' | 'logistics' | 'risk';
  status: 'active' | 'idle' | 'processing' | 'error' | 'stopped';
  version: string;
  uptime: string;
  lastAction: string;
  actionsToday: number;
  successRate: number;
  avgResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorCount: number;
  capabilities: string[];
  configuration: Record<string, any>;
  metrics: {
    totalActions: number;
    successfulActions: number;
    failedActions: number;
    avgProcessingTime: number;
  };
}

interface AgentAction {
  id: string;
  agentId: string;
  timestamp: Date;
  action: string;
  status: 'success' | 'failed' | 'pending';
  duration: number;
  details: string;
  input?: any;
  output?: any;
}

// Mock Data
const mockAgents: Agent[] = [
  {
    id: 'proc-001',
    name: 'Procurement Agent',
    type: 'procurement',
    status: 'active',
    version: '2.1.0',
    uptime: '7 days, 14 hours',
    lastAction: 'Analyzed supplier performance metrics',
    actionsToday: 47,
    successRate: 96.8,
    avgResponseTime: 1.2,
    memoryUsage: 68,
    cpuUsage: 23,
    errorCount: 2,
    capabilities: ['Supplier Analysis', 'Contract Negotiation', 'Price Optimization', 'Risk Assessment'],
    configuration: {
      maxConcurrentTasks: 10,
      timeoutSeconds: 30,
      retryAttempts: 3,
      learningRate: 0.001
    },
    metrics: {
      totalActions: 1247,
      successfulActions: 1207,
      failedActions: 40,
      avgProcessingTime: 1.2
    }
  },
  {
    id: 'log-001',
    name: 'Logistics Agent',
    type: 'logistics',
    status: 'processing',
    version: '2.0.5',
    uptime: '12 days, 3 hours',
    lastAction: 'Optimizing delivery routes for Chennai region',
    actionsToday: 32,
    successRate: 94.2,
    avgResponseTime: 2.1,
    memoryUsage: 74,
    cpuUsage: 45,
    errorCount: 5,
    capabilities: ['Route Optimization', 'Shipment Tracking', 'Warehouse Management', 'Load Balancing'],
    configuration: {
      maxRoutes: 50,
      optimizationAlgorithm: 'genetic',
      realTimeUpdates: true,
      geofenceRadius: 100
    },
    metrics: {
      totalActions: 892,
      successfulActions: 840,
      failedActions: 52,
      avgProcessingTime: 2.1
    }
  },
  {
    id: 'risk-001',
    name: 'Risk Management Agent',
    type: 'risk',
    status: 'active',
    version: '1.9.2',
    uptime: '5 days, 8 hours',
    lastAction: 'Generated risk assessment for new supplier',
    actionsToday: 28,
    successRate: 98.1,
    avgResponseTime: 0.8,
    memoryUsage: 52,
    cpuUsage: 18,
    errorCount: 1,
    capabilities: ['Risk Prediction', 'Compliance Monitoring', 'Threat Detection', 'Impact Analysis'],
    configuration: {
      riskThreshold: 0.7,
      monitoringInterval: 300,
      alertSeverity: 'medium',
      historicalDataDays: 90
    },
    metrics: {
      totalActions: 634,
      successfulActions: 622,
      failedActions: 12,
      avgProcessingTime: 0.8
    }
  }
];

const mockActions: AgentAction[] = [
  {
    id: 'act-001',
    agentId: 'proc-001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    action: 'Supplier Performance Analysis',
    status: 'success',
    duration: 1.2,
    details: 'Analyzed 15 suppliers for Q4 performance metrics'
  },
  {
    id: 'act-002',
    agentId: 'log-001',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    action: 'Route Optimization',
    status: 'success',
    duration: 3.5,
    details: 'Optimized 23 delivery routes, saved 12% in fuel costs'
  },
  {
    id: 'act-003',
    agentId: 'risk-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    action: 'Risk Assessment',
    status: 'success',
    duration: 0.9,
    details: 'Evaluated supply chain disruption risks for monsoon season'
  }
];

// Components
const AgentCard: React.FC<{ agent: Agent; onSelect: (agent: Agent) => void }> = ({ agent, onSelect }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      idle: 'bg-gray-100 text-gray-700 border-gray-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      stopped: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[status as keyof typeof colors] || colors.idle;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: CheckCircle,
      processing: RefreshCw,
      idle: Clock,
      error: AlertTriangle,
      stopped: Square
    };
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent size={16} className={status === 'processing' ? 'animate-spin' : ''} />;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      procurement: Bot,
      logistics: Network,
    //   risk: Shield
    };
    const IconComponent = icons[type as keyof typeof icons] || Bot;
    return <IconComponent size={24} />;
  };

  return (
    <div 
      className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onSelect(agent)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getTypeIcon(agent.type)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600">v{agent.version}</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-2 ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Actions Today</p>
            <p className="text-lg font-bold text-gray-900">{agent.actionsToday}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-green-600">{agent.successRate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Avg Response</p>
            <p className="text-sm font-semibold text-gray-900">{agent.avgResponseTime}s</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Uptime</p>
            <p className="text-sm font-semibold text-gray-900">{agent.uptime}</p>
          </div>
        </div>

        {/* System Resources */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Cpu size={12} /> CPU
            </span>
            <span className="text-xs font-medium">{agent.cpuUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${agent.cpuUsage}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <MemoryStick size={12} /> Memory
            </span>
            <span className="text-xs font-medium">{agent.memoryUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all duration-300" 
              style={{ width: `${agent.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Last Action */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-600 mb-1">Last Action</p>
          <p className="text-sm text-gray-900">{agent.lastAction}</p>
        </div>
      </div>
    </div>
  );
};

const AgentDetailPanel: React.FC<{ agent: Agent; onClose: () => void }> = ({ agent, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: Database }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{agent.name}</h2>
                <p className="opacity-90">Agent ID: {agent.id} • Version {agent.version}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status and Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Agent Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-medium">{agent.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Count</span>
                      <span className="font-medium text-red-600">{agent.errorCount}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Controls</h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Play size={16} />
                      Start
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      <Pause size={16} />
                      Pause
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Square size={16} />
                      Stop
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <RefreshCw size={16} />
                      Restart
                    </button>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map(capability => (
                    <span 
                      key={capability}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-blue-600" size={20} />
                    <span className="text-sm font-medium text-blue-800">Total Actions</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">{agent.metrics.totalActions}</span>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-800">Successful</span>
                  </div>
                  <span className="text-2xl font-bold text-green-900">{agent.metrics.successfulActions}</span>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-red-600" size={20} />
                    <span className="text-sm font-medium text-red-800">Failed</span>
                  </div>
                  <span className="text-2xl font-bold text-red-900">{agent.metrics.failedActions}</span>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="text-purple-600" size={20} />
                    <span className="text-sm font-medium text-purple-800">Avg Time</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-900">{agent.metrics.avgProcessingTime}s</span>
                </div>
              </div>

              {/* Resource Usage Chart Placeholder */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Resource Usage (Last 24h)</h4>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Performance chart would be rendered here</p>
                    <p className="text-sm">(Integration with Recharts for production)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(agent.configuration).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type={typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'checkbox' : 'text'}
                      defaultValue={typeof value === 'boolean' ? undefined : String(value)}
                      defaultChecked={typeof value === 'boolean' ? value : undefined}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  <Download size={14} />
                  Export Logs
                </button>
              </div>
              
              <div className="space-y-2">
                {mockActions.filter(action => action.agentId === agent.id).map(action => (
                  <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{action.action}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        action.status === 'success' ? 'bg-green-100 text-green-700' : 
                        action.status === 'failed' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{action.details}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{action.timestamp.toLocaleString()}</span>
                      <span>Duration: {action.duration}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AgentsManagement: React.FC = () => {
  const [agents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🤖 AI Agents Management
            </h1>
            <p className="text-gray-600">
              Monitor, configure, and manage your intelligent agents
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw size={16} />
              Refresh All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Play size={16} />
              Deploy New Agent
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search agents..."
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
            <option value="active">Active</option>
            <option value="processing">Processing</option>
            <option value="idle">Idle</option>
            <option value="error">Error</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onSelect={setSelectedAgent}
          />
        ))}
      </div>

      {/* System Overview */}
      <div className="mt-8 bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={24} />
          System Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{agents.filter(a => a.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {agents.reduce((sum, a) => sum + a.actionsToday, 0)}
            </div>
            <div className="text-sm text-gray-600">Actions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {agents.reduce((sum, a) => sum + a.errorCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Errors</div>
          </div>
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailPanel 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </div>
  );
};

export default AgentsManagement;