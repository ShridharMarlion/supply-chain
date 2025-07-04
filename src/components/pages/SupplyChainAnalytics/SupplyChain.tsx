import React, { useState } from 'react';
import { 
  Home, 
  Bot, 
  BarChart3, 
  Settings, 
  Truck, 
  User,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  HelpCircle,
  Shield,
  Activity,
  Globe,
  Database,
  Zap,
  Target,
  TrendingUp,
  Package,
  Users,
  AlertTriangle
} from 'lucide-react';

// Import all our components
import MainDashboard from '../SupplyChainAnalytics/MainDashboard.tsx';
import AgentsManagement from '../AgentManagement/AgentManagement.tsx';
import AnalyticsReports from './AnalyticsReport'
import SettingsConfiguration from '../Settings/SettingsConfiguration.tsx';
import SupplyChainMonitoring from './SupplyChainMonitoring.tsx'

// Types
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  path: string;
  children?: NavigationItem[];
  badge?: number;
  description?: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Navigation configuration
const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Executive Dashboard',
    icon: Home,
    path: '/dashboard',
    description: 'Overview of key metrics and KPIs'
  },
  {
    id: 'agents',
    label: 'AI Agents',
    icon: Bot,
    path: '/agents',
    badge: 3,
    description: 'Manage and monitor AI agents'
  },
  {
    id: 'monitoring',
    label: 'Supply Chain',
    icon: Truck,
    path: '/monitoring',
    children: [
      {
        id: 'shipments',
        label: 'Shipments',
        icon: Package,
        path: '/monitoring/shipments'
      },
      {
        id: 'suppliers',
        label: 'Suppliers',
        icon: Users,
        path: '/monitoring/suppliers'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: Database,
        path: '/monitoring/inventory'
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: BarChart3,
    path: '/analytics',
    description: 'Data insights and reporting'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    children: [
      {
        id: 'profile',
        label: 'User Profile',
        icon: User,
        path: '/settings/profile'
      },
      {
        id: 'system',
        label: 'System Config',
        icon: Settings,
        path: '/settings/system'
      },
      {
        id: 'security',
        label: 'Security',
        icon: Shield,
        path: '/settings/security'
      }
    ]
  }
];

// Mock user data
const currentUser: User = {
  name: 'Sridhar Alagiriswamy',
  email: 'sridhar@supplychain.ai',
  role: 'AI/ML Engineer'
};

// Components
const NavigationLink: React.FC<{
  item: NavigationItem;
  isActive: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  onClick: () => void;
  level?: number;
}> = ({ item, isActive, isExpanded, onToggle, onClick, level = 0 }) => {
  const IconComponent = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level === 0 ? 'pl-4' : 'pl-8';

  return (
    <div>
      <button
        onClick={hasChildren ? onToggle : onClick}
        className={`w-full flex items-center justify-between ${paddingLeft} pr-4 py-3 text-left transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <IconComponent size={20} />
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {hasChildren && (
          <ChevronRight 
            size={16} 
            className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
          />
        )}
      </button>
      
      {hasChildren && isExpanded && (
        <div className="bg-gray-50">
          {item.children!.map(child => (
            <NavigationLink
              key={child.id}
              item={child}
              isActive={isActive && child.path === window.location.pathname}
              onClick={() => onClick()}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}> = ({ isOpen, onClose, currentPath, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['monitoring', 'settings']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:shadow-none`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">SupplyChain AI</h1>
              <p className="text-xs text-gray-600">Enterprise Platform</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="py-4">
            {navigationItems.map(item => (
              <NavigationLink
                key={item.id}
                item={item}
                isActive={currentPath.startsWith(item.path)}
                isExpanded={expandedItems.includes(item.id)}
                onToggle={() => toggleExpanded(item.id)}
                onClick={() => handleNavigate(item.path)}
              />
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{currentUser.name}</p>
              <p className="text-xs text-gray-600">{currentUser.role}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
              <HelpCircle size={16} />
              Help & Support
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Header: React.FC<{
  onMenuClick: () => void;
  currentPath: string;
}> = ({ onMenuClick, currentPath }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const getPageTitle = (path: string) => {
    const item = navigationItems.find(item => 
      path.startsWith(item.path) || 
      item.children?.some(child => path.startsWith(child.path))
    );
    return item?.label || 'Dashboard';
  };

  const mockNotifications = [
    { id: 1, title: 'High Risk Alert', message: 'Supplier performance below threshold', time: '2 min ago', type: 'warning' },
    { id: 2, title: 'Shipment Delayed', message: 'SHP-001 estimated delay of 4 hours', time: '15 min ago', type: 'error' },
    { id: 3, title: 'Agent Update', message: 'Procurement agent completed optimization', time: '1 hour ago', type: 'success' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{getPageTitle(currentPath)}</h2>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
            
            {showSearch && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                <input
                  type="text"
                  placeholder="Search shipments, suppliers, agents..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>Quick search across all modules</p>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:text-gray-700 relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map(notification => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-600">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const SupplyChainApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard');

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <MainDashboard />;
      case '/agents':
        return <AgentsManagement />;
      case '/monitoring':
      case '/monitoring/shipments':
      case '/monitoring/suppliers':
      case '/monitoring/inventory':
        return <SupplyChainMonitoring />;
      case '/analytics':
        return <AnalyticsReports />;
      case '/settings':
      case '/settings/profile':
      case '/settings/system':
      case '/settings/security':
        return <SettingsConfiguration />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          currentPath={currentPath}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default SupplyChainApp;