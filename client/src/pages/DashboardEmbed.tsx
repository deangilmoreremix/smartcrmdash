import React from 'react';
import { useTheme } from '@contexts/ThemeContext';
import EmbeddableDashboard from '../components/EmbeddableDashboard';
import '../styles/dashboard-embed.css';

const DashboardEmbed: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen p-4 ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 to-blue-50'}`}>
      <div className="max-w-6xl mx-auto">
                <div className="embed-container">
                  <header className="embed-header">
                    <h1>Smart CRM Dashboard</h1>
                    <p>Real-time insights into your business performance</p>
                    <div className="feature-badges" role="list" aria-label="Dashboard features">
                      <div className="feature-badge" role="listitem" aria-label="Auto-refreshing dashboard">
                        <span aria-hidden="true">🔄</span> Auto-refreshing
                      </div>
                      <div className="feature-badge" role="listitem" aria-label="Real-time data updates">
                        <span aria-hidden="true">📊</span> Real-time data
                      </div>
                      <div className="feature-badge" role="listitem" aria-label="AI-powered insights">
                        <span aria-hidden="true">🎯</span> AI-powered insights
                      </div>
                    </div>
                  </header>

          <div className="embed-content">
            <EmbeddableDashboard />
          </div>

          <section className="embed-actions" aria-labelledby="actions-heading">
            <p id="actions-heading">Experience the full power of our CRM platform</p>
            <div className="action-buttons">
              <a href="/auth/login" className="btn-primary" aria-label="Get started with SmartCRM for free">
                Get Started Free
              </a>
              <a href="/dashboard" className="btn-secondary" aria-label="View the complete dashboard">
                View Full Dashboard
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmbed;