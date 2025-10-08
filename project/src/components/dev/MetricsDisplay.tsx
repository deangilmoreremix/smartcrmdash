import React from 'react';
import { getPerformanceMetrics, AnimationMetrics } from '../../utils/performanceMetrics';

interface MetricsDisplayProps {
  componentName?: string;
}

const isAnimationMetrics = (data: unknown): data is AnimationMetrics => {
  if (!data || typeof data !== 'object') return false;
  const metrics = data as Record<string, unknown>;
  return (
    typeof metrics['component'] === 'string' &&
    typeof metrics['loadTime'] === 'number' &&
    typeof metrics['fps'] === 'number' &&
    typeof metrics['interactionDelay'] === 'number' &&
    typeof metrics['frameDrops'] === 'number'
  );
};

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ componentName }) => {
  if (process.env['NODE_ENV'] === 'production') {
    return null;
  }

  const metrics = getPerformanceMetrics();
  const data = componentName ? metrics[componentName] : undefined;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
      <h3 className="font-bold text-lg mb-2">Performance Metrics</h3>
      {isAnimationMetrics(data) ? (
        <div className="space-y-2">
          <div>
            <span className="font-medium">Component:</span> {data.component}
          </div>
          <div>
            <span className="font-medium">Load Time:</span> {data.loadTime.toFixed(2)}ms
          </div>
          <div>
            <span className="font-medium">FPS:</span> {data.fps}
          </div>
          <div>
            <span className="font-medium">Interaction Delay:</span> {data.interactionDelay.toFixed(2)}ms
          </div>
          <div>
            <span className="font-medium">Frame Drops:</span> {data.frameDrops}
          </div>
        </div>
      ) : (
        <p>No metrics collected yet</p>
      )}
    </div>
  );
};

<AIAutoFillButton onAutoFill={handleAutoFill} formData={formData} />
<AIResearchButton onDataFound={handleAIResearch} searchQuery={query} />