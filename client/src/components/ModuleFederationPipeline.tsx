import React, { useState, useEffect } from 'react';
import { loadRemoteComponent } from '../utils/dynamicModuleFederation';

const PipelineApp: React.FC = () => {
  const [RemotePipeline, setRemotePipeline] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRemote = async () => {
      try {
        // Silently attempt Module Federation loading
        
        // Reduced timeout for faster fallback to iframe
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Module Federation loading timeout')), 2000);
        });
        
        const modulePromise = loadRemoteComponent(
          'https://cheery-syrniki-b5b6ca.netlify.app',
          'PipelineApp',
          './PipelineApp'
        );
        
        const module = await Promise.race([modulePromise, timeoutPromise]);
        setRemotePipeline(() => (module as any).default || module);
        console.log('✅ Module Federation Pipeline loaded successfully');
      } catch (err) {
        // Module Federation unavailable, using iframe fallback (normal behavior)
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadRemote();
  }, []);

  if (error || !RemotePipeline) {
    // Fallback to iframe
    return (
      <iframe
        src="https://cheery-syrniki-b5b6ca.netlify.app"
        className="w-full h-full border-0"
        title="Remote Pipeline System"
        allow="clipboard-read; clipboard-write; fullscreen; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-navigation allow-top-navigation"
      />
    );
  }

  return <RemotePipeline />;
};

interface ModuleFederationPipelineProps {
  showHeader?: boolean;
}

const ModuleFederationPipeline: React.FC<ModuleFederationPipelineProps> = ({ showHeader = false }) => {
  return (
    <div className="h-full w-full flex flex-col">
      {showHeader && (
        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pipeline Deals</h3>
            <div className="flex items-center text-green-600 text-xs">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Module Federation
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 h-full">
        <PipelineApp />
      </div>
    </div>
  );
};

export default ModuleFederationPipeline;