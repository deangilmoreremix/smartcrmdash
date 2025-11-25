import React from 'react';
import { Badge } from './badge';
import { Bot, Wifi, WifiOff, Clock } from 'lucide-react';

interface AssistantStatusWidgetProps {
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

export default function AssistantStatusWidget({
  status = 'online',
  className = ''
}: AssistantStatusWidgetProps) {
  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'offline':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <Wifi className="w-3 h-3" />;
      case 'offline':
        return <WifiOff className="w-3 h-3" />;
      case 'busy':
        return <Clock className="w-3 h-3" />;
      default:
        return <Bot className="w-3 h-3" />;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        Assistant {capitalizeStatus(status)}
      </Badge>
    </div>
  );
}
