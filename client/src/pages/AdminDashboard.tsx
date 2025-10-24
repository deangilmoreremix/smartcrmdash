import React from 'react';
import { Shield, Users, Database, Activity, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '../store/authStore';
import AdminNavigation from '../components/AdminNavigation';

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

      {/* Admin Tools */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Admin Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = '/bulk-import'}
            className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900 dark:text-white">Bulk Import Users</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Import multiple users via CSV</p>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/admin/users'}
            className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900 dark:text-white">User Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage user accounts</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Admin Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Admin Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Bulk import: 25 users added successfully</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">2 hours ago by</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">System backup completed</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">6 hours ago - Automated</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">User permissions updated for 5 accounts</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">1 day ago by dean@videoremix.io</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;