import React, { useState } from 'react'; // Added useState import
import RevenueSharingDashboard from '@/components/billing/RevenueSharingDashboard';
import { DollarSign, TrendingUp, Users, BarChart3, Target, Award } from 'lucide-react'; // Assuming these icons are available

interface PartnerTier {
  id: string;
  name: string;
  commissionRate: number;
  minimumRevenue: number;
  features: string[];
  color: string;
}

interface RevenueMetrics {
  totalRevenue: number;
  partnerCommissions: number;
  netRevenue: number;
  avgRevenuePerPartner: number;
  topPerformingPartners: Array<{
    id: string;
    name: string;
    revenue: number;
    commission: number;
    customers: number;
  }>;
}

export default function RevenueSharingPage() {
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalRevenue: 150000, // Example data
    partnerCommissions: 30000, // Example data
    netRevenue: 120000, // Example data
    avgRevenuePerPartner: 10000, // Example data
    topPerformingPartners: [
      { id: 'p1', name: 'Alpha Solutions', revenue: 50000, commission: 10000, customers: 150 },
      { id: 'p2', name: 'Beta Innovations', revenue: 30000, commission: 6000, customers: 100 },
      { id: 'p3', name: 'Gamma Corp', revenue: 20000, commission: 4000, customers: 75 }
    ]
  });

  const partnerTiers: PartnerTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Partner',
      commissionRate: 15,
      minimumRevenue: 0,
      features: ['Basic white-label', 'Email support', 'Monthly reporting'],
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'silver',
      name: 'Silver Partner',
      commissionRate: 20,
      minimumRevenue: 10000,
      features: ['Advanced white-label', 'Priority support', 'Weekly reporting', 'Custom domain'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'gold',
      name: 'Gold Partner',
      commissionRate: 25,
      minimumRevenue: 50000,
      features: ['Premium white-label', 'Dedicated support', 'Real-time analytics', 'API access'],
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'platinum',
      name: 'Platinum Partner',
      commissionRate: 30,
      minimumRevenue: 100000,
      features: ['Complete white-label', '24/7 support', 'Custom integrations', 'Revenue guarantees'],
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Revenue Sharing & Partner Tiers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage partner commissions and tier-based incentives
            </p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Process Payouts
          </button>
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partner Commissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.partnerCommissions)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.netRevenue)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Revenue/Partner</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.avgRevenuePerPartner)}</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Partner Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {partnerTiers.map((tier) => (
            <div key={tier.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-t-4 border-purple-500">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} flex items-center justify-center mb-4`}>
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Commission: <span className="font-semibold text-green-600">{tier.commissionRate}%</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Min Revenue: <span className="font-semibold">{formatCurrency(tier.minimumRevenue)}</span>
                </p>
              </div>
              <ul className="space-y-1">
                {tier.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Top Performing Partners */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Performing Partners</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Partner Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission Earned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.topPerformingPartners.map((partner) => (
                  <tr key={partner.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{partner.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(partner.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(partner.commission)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{partner.customers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}