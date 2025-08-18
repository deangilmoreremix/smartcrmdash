
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DealRiskMonitor: React.FC = () => {
  const riskDeals = [
    { id: 1, name: 'Enterprise Software License', risk: 'High', value: '$75,000', reason: 'No activity in 14 days' },
    { id: 2, name: 'Marketing Platform', risk: 'Medium', value: '$45,000', reason: 'Budget concerns raised' },
    { id: 3, name: 'CRM Integration', risk: 'Low', value: '$25,000', reason: 'On track for closure' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'Medium': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deal Risk Monitor</h1>
        <div className="text-sm text-gray-500">AI-powered risk assessment</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Deals</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk Deals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">15</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Risk Deals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">124</div>
            <p className="text-xs text-muted-foreground">On track</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getRiskIcon(deal.risk)}
                  <div>
                    <h3 className="font-medium">{deal.name}</h3>
                    <p className="text-sm text-gray-500">{deal.reason}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">{deal.value}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(deal.risk)}`}>
                    {deal.risk} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealRiskMonitor;
