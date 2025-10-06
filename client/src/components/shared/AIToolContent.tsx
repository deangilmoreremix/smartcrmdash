import React from 'react';

interface AIToolContentProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AIToolContent: React.FC<AIToolContentProps> = ({
  title,
  description,
  icon,
  children,
  className = ''
}) => {
  return (
    <div className={`ai-tool-content ${className}`}>
      {(title || description || icon) && (
        <div className="ai-tool-header mb-6">
          {icon && <div className="ai-tool-icon mb-3">{icon}</div>}
          {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>}
          {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}
      <div className="ai-tool-body">{children}</div>
    </div>
  );
};

export default AIToolContent;
