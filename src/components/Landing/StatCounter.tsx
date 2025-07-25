import React, { useState, useEffect } from 'react';

interface StatCounterProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ 
  icon, 
  label, 
  value, 
  suffix = '', 
  decimals = 0 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-center mb-4 text-blue-600">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

export default StatCounter;
