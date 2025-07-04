import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Wifi, 
  Monitor,
  Palette,
  Globe,
  Lock,
  Key,
  Mail,
  Phone,
  MapPin,
  Clock,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Copy
} from 'lucide-react';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  location: string;
  timezone: string;
  avatar?: string;
  lastLogin: string;
}

interface SystemSettings {
  dataRetention: number;
  autoBackup: boolean;
  backupFrequency: string;
  maintenanceWindow: string;
  maxConcurrentUsers: number;
  sessionTimeout: number;
  apiRateLimit: number;
}

interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  alertThresholds: {
    performance: number;
    risk: number;
    cost: number;
  };
  reportFrequency: string;
  recipients: string[];
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordComplexity: boolean;
  sessionSecurity: boolean;
  ipWhitelist: string[];
  auditLogging: boolean;
  encryptionLevel: string;
}

interface IntegrationConfig {
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  config: Record<string, any>;
}

// Mock Data
const mockUser: UserProfile = {
  id: 'usr-001',
  name: 'Sridhar Alagiriswamy',
  email: 'sridhar@supplychain.ai',
  role: 'AI/ML Engineer',
  department: 'Technology',
  phone: '+91 98765 43210',
  location: 'Chennai, Tamil Nadu, India',
  timezone: 'Asia/Kolkata (IST)',
  lastLogin: '2024-07-05 14:30:00'
};

const mockSystemSettings: SystemSettings = {
  dataRetention: 90,
  autoBackup: true,
  backupFrequency: 'daily',
  maintenanceWindow: '02:00-04:00',
  maxConcurrentUsers: 100,
  sessionTimeout: 30,
  apiRateLimit: 1000
};

const mockNotifications: NotificationSettings = {
  emailAlerts: true,
  smsAlerts: false,
  pushNotifications: true,
  alertThresholds: {
    performance: 85,
    risk: 70,
    cost: 90
  },
  reportFrequency: 'weekly',
  recipients: ['admin@company.com', 'manager@company.com']
};

const mockSecurity: SecuritySettings = {
  twoFactorAuth: true,
  passwordComplexity: true,
  sessionSecurity: true,
  ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
  auditLogging: true,
  encryptionLevel: 'AES-256'
};

const mockIntegrations: IntegrationConfig[] = [
  {
    name: 'SAP ERP',
    type: 'ERP System',
    status: 'connected',
    lastSync: '2 minutes ago',
    config: { endpoint: 'https://sap.company.com/api', timeout: 30 }
  },
  {
    name: 'Weather API',
    type: 'External Data',
    status: 'connected',
    lastSync: '5 minutes ago',
    config: { apiKey: 'hidden', updateInterval: 300 }
  },
  {
    name: 'Supplier Portal',
    type: 'B2B Integration',
    status: 'error',
    lastSync: '2 hours ago',
    config: { endpoint: 'https://suppliers.company.com', retryAttempts: 3 }
  },
  {
    name: 'Logistics Provider',
    type: 'Shipping API',
    status: 'connected',
    lastSync: '1 minute ago',
    config: { apiUrl: 'https://logistics.provider.com/v2', trackingEnabled: true }
  }
];

// Components
const SettingsSection: React.FC<{ 
  title: string; 
  description: string; 
  icon: React.ComponentType<{ size: number; className?: string }>; 
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, description, icon: IconComponent, children, actions }) => (
  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <IconComponent size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </div>
);

const FormField: React.FC<{
  label: string;
  type?: string;
  value: string | number | boolean;
  onChange: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
  description?: string;
}> = ({ label, type = 'text', value, onChange, options, disabled = false, description }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {description && <p className="text-xs text-gray-500">{description}</p>}
    
    {type === 'select' && options ? (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : type === 'checkbox' ? (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
        />
        <span className="ml-2 text-sm text-gray-600">Enable this setting</span>
      </div>
    ) : type === 'textarea' ? (
      <textarea
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
      />
    ) : (
      <input
        type={type}
        value={String(value)}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
      />
    )}
  </div>
);

const IntegrationCard: React.FC<{ integration: IntegrationConfig; onEdit: () => void; onDelete: () => void }> = ({ 
  integration, 
  onEdit, 
  onDelete 
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      connected: 'bg-green-100 text-green-700 border-green-200',
      disconnected: 'bg-gray-100 text-gray-700 border-gray-200',
      error: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.disconnected;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      connected: Check,
      disconnected: X,
      error: AlertTriangle
    };
    const IconComponent = icons[status as keyof typeof icons] || X;
    return <IconComponent size={16} />;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{integration.name}</h4>
          <p className="text-sm text-gray-600">{integration.type}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 ${getStatusColor(integration.status)}`}>
          {getStatusIcon(integration.status)}
          {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">
        Last sync: {integration.lastSync}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onEdit}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          <Edit size={12} />
          Edit
        </button>
        <button 
          onClick={onDelete}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
};

const SettingsConfiguration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(mockUser);
  const [systemSettings, setSystemSettings] = useState(mockSystemSettings);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [security, setSecurity] = useState(mockSecurity);
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Wifi },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSave = () => {
    // Simulate save operation
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    // Reset to original values
    setUserProfile(mockUser);
    setSystemSettings(mockSystemSettings);
    setNotifications(mockNotifications);
    setSecurity(mockSecurity);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Settings & Configuration
            </h1>
            <p className="text-gray-600">
              Manage system preferences, user settings, and integrations
            </p>
          </div>
          
          {hasChanges && (
            <div className="mt-4 lg:mt-0 flex gap-3">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <RefreshCw size={16} />
                Reset
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <SettingsSection
              title="Personal Information"
              description="Update your personal details and contact information"
              icon={User}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  value={userProfile.name}
                  onChange={(value) => {
                    setUserProfile({...userProfile, name: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Email Address"
                  type="email"
                  value={userProfile.email}
                  onChange={(value) => {
                    setUserProfile({...userProfile, email: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  value={userProfile.phone}
                  onChange={(value) => {
                    setUserProfile({...userProfile, phone: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Location"
                  value={userProfile.location}
                  onChange={(value) => {
                    setUserProfile({...userProfile, location: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Role"
                  value={userProfile.role}
                  onChange={(value) => {
                    setUserProfile({...userProfile, role: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Department"
                  value={userProfile.department}
                  onChange={(value) => {
                    setUserProfile({...userProfile, department: value});
                    setHasChanges(true);
                  }}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Account Preferences"
              description="Timezone and display preferences"
              icon={Clock}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Timezone"
                  type="select"
                  value={userProfile.timezone}
                  onChange={(value) => {
                    setUserProfile({...userProfile, timezone: value});
                    setHasChanges(true);
                  }}
                  options={[
                    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                    { value: 'America/New_York', label: 'America/New_York (EST)' },
                    { value: 'Europe/London', label: 'Europe/London (GMT)' },
                    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' }
                  ]}
                />
              </div>
            </SettingsSection>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <SettingsSection
              title="Data Management"
              description="Configure data retention and backup settings"
              icon={Database}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Data Retention (days)"
                  type="number"
                  value={systemSettings.dataRetention}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, dataRetention: value});
                    setHasChanges(true);
                  }}
                  description="How long to keep historical data"
                />
                <FormField
                  label="Auto Backup"
                  type="checkbox"
                  value={systemSettings.autoBackup}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, autoBackup: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Backup Frequency"
                  type="select"
                  value={systemSettings.backupFrequency}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, backupFrequency: value});
                    setHasChanges(true);
                  }}
                  options={[
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' }
                  ]}
                />
                <FormField
                  label="Maintenance Window"
                  value={systemSettings.maintenanceWindow}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, maintenanceWindow: value});
                    setHasChanges(true);
                  }}
                  description="Format: HH:MM-HH:MM"
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Performance Settings"
              description="Configure system performance and limits"
              icon={Monitor}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Max Concurrent Users"
                  type="number"
                  value={systemSettings.maxConcurrentUsers}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, maxConcurrentUsers: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Session Timeout (minutes)"
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, sessionTimeout: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="API Rate Limit (requests/hour)"
                  type="number"
                  value={systemSettings.apiRateLimit}
                  onChange={(value) => {
                    setSystemSettings({...systemSettings, apiRateLimit: value});
                    setHasChanges(true);
                  }}
                />
              </div>
            </SettingsSection>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <SettingsSection
              title="Alert Preferences"
              description="Configure how you receive notifications"
              icon={Bell}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Email Alerts"
                  type="checkbox"
                  value={notifications.emailAlerts}
                  onChange={(value) => {
                    setNotifications({...notifications, emailAlerts: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="SMS Alerts"
                  type="checkbox"
                  value={notifications.smsAlerts}
                  onChange={(value) => {
                    setNotifications({...notifications, smsAlerts: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Push Notifications"
                  type="checkbox"
                  value={notifications.pushNotifications}
                  onChange={(value) => {
                    setNotifications({...notifications, pushNotifications: value});
                    setHasChanges(true);
                  }}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Alert Thresholds"
              description="Set when to trigger alerts based on performance metrics"
              icon={AlertTriangle}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Performance Threshold (%)"
                  type="number"
                  value={notifications.alertThresholds.performance}
                  onChange={(value) => {
                    setNotifications({
                      ...notifications, 
                      alertThresholds: {...notifications.alertThresholds, performance: value}
                    });
                    setHasChanges(true);
                  }}
                  description="Alert when below this value"
                />
                <FormField
                  label="Risk Threshold (%)"
                  type="number"
                  value={notifications.alertThresholds.risk}
                  onChange={(value) => {
                    setNotifications({
                      ...notifications, 
                      alertThresholds: {...notifications.alertThresholds, risk: value}
                    });
                    setHasChanges(true);
                  }}
                  description="Alert when above this value"
                />
                <FormField
                  label="Cost Threshold (%)"
                  type="number"
                  value={notifications.alertThresholds.cost}
                  onChange={(value) => {
                    setNotifications({
                      ...notifications, 
                      alertThresholds: {...notifications.alertThresholds, cost: value}
                    });
                    setHasChanges(true);
                  }}
                  description="Alert when above budget %"
                />
              </div>
            </SettingsSection>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <SettingsSection
              title="Authentication & Access"
              description="Configure security and access controls"
              icon={Shield}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Two-Factor Authentication"
                  type="checkbox"
                  value={security.twoFactorAuth}
                  onChange={(value) => {
                    setSecurity({...security, twoFactorAuth: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Password Complexity"
                  type="checkbox"
                  value={security.passwordComplexity}
                  onChange={(value) => {
                    setSecurity({...security, passwordComplexity: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Enhanced Session Security"
                  type="checkbox"
                  value={security.sessionSecurity}
                  onChange={(value) => {
                    setSecurity({...security, sessionSecurity: value});
                    setHasChanges(true);
                  }}
                />
                <FormField
                  label="Audit Logging"
                  type="checkbox"
                  value={security.auditLogging}
                  onChange={(value) => {
                    setSecurity({...security, auditLogging: value});
                    setHasChanges(true);
                  }}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Encryption & Data Protection"
              description="Configure encryption and data protection settings"
              icon={Lock}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Encryption Level"
                  type="select"
                  value={security.encryptionLevel}
                  onChange={(value) => {
                    setSecurity({...security, encryptionLevel: value});
                    setHasChanges(true);
                  }}
                  options={[
                    { value: 'AES-128', label: 'AES-128' },
                    { value: 'AES-256', label: 'AES-256' },
                    { value: 'AES-512', label: 'AES-512' }
                  ]}
                />
              </div>
            </SettingsSection>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <SettingsSection
              title="System Integrations"
              description="Manage external system connections and APIs"
              icon={Wifi}
              actions={
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={16} />
                  Add Integration
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <IntegrationCard
                    key={index}
                    integration={integration}
                    onEdit={() => alert(`Edit ${integration.name} integration`)}
                    onDelete={() => alert(`Delete ${integration.name} integration`)}
                  />
                ))}
              </div>
            </SettingsSection>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <SettingsSection
              title="Theme & Display"
              description="Customize the look and feel of your dashboard"
              icon={Palette}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Theme"
                  type="select"
                  value="light"
                  onChange={() => setHasChanges(true)}
                  options={[
                    { value: 'light', label: 'Light Theme' },
                    { value: 'dark', label: 'Dark Theme' },
                    { value: 'auto', label: 'Auto (System)' }
                  ]}
                />
                <FormField
                  label="Language"
                  type="select"
                  value="en"
                  onChange={() => setHasChanges(true)}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' }
                  ]}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Dashboard Layout"
              description="Customize dashboard layout and components"
              icon={Monitor}
            >
              <div className="text-center py-8 text-gray-500">
                <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                <p>Dashboard customization options</p>
                <p className="text-sm">(Widget ordering, layout preferences, etc.)</p>
              </div>
            </SettingsSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsConfiguration;