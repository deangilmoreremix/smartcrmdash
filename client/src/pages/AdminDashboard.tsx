
import React from 'react';
import { Shield, Users, Database, Activity, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import AdminNavigation from '@/components/AdminNavigation';

const AdminDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuthStore();

  // Admin stats (you can make these dynamic by fetching from API)
  const adminStats = [
    {
      title: 'Total Users',
      value: '247',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '+5%',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'System Health',
      value: '98.5%',
      change: '+0.2%',
      icon: Database,
      color: 'green'
    },
    {
      title: 'Alerts',
      value: '3',
      change: '-2',
      icon: AlertTriangle,
      color: 'yellow'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back, {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            ADMIN ACCESS
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            System Administrator
          </span>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${isDark ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'yellow' ? 'text-yellow-600' :
                  'text-gray-600'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Navigation */}
      <AdminNavigation />

      {/* Recent Admin Activity */}
      <div className={`${isDark ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Recent Admin Activity
        </h3>
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Bulk import: 25 users added successfully
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              2 hours ago by {user?.email}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              System backup completed
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              6 hours ago - Automated
            </p>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
            <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              User permissions updated for 5 accounts
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              1 day ago by dean@videoremix.io
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
