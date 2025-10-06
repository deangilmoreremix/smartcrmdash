import React from 'react';

interface StructuredAIResultProps {
  result: any;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const StructuredAIResult: React.FC<StructuredAIResultProps> = ({
  result,
  loading = false,
  error = null,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`structured-ai-result loading ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Processing...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`structured-ai-result error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`structured-ai-result empty ${className}`}>
        <div className="text-center p-8 text-gray-500">
          <p>No results to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`structured-ai-result ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {typeof result === 'string' ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </h4>
                <div className="text-gray-700 dark:text-gray-300">
                  {typeof value === 'object' ? (
                    <pre className="bg-gray-50 dark:bg-gray-900 rounded p-3 overflow-x-auto text-sm">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <p className="whitespace-pre-wrap">{String(value)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StructuredAIResult;
