import React from 'react';

import AutomateButton from '../components/AutomateButton';

const LeadAutomation = () => {
  const automations = [
    {
      title: 'Analyze Deal',
      description: 'Use AI to analyze a deal and suggest next steps.'
    },
    {
      title: 'Score Lead',
      description: 'Predict lead score and view reasoning.'
    },
    {
      title: 'Draft Email',
      description: 'Generate a personalized outreach email.'
    },
    {
      title: 'Schedule Follow-Up',
      description: 'Create an appointment with recommended timing.'
    },
    {
      title: 'Automatic Meeting Scheduling',
      description: 'Pick an available time and create a calendar event.'
    },
    {
      title: 'Contact Data Enrichment',
      description: 'Fill in missing contact info from public sources.'
    },
    {
      title: 'Deal Risk Alerts',
      description: 'Detect stalled deals and recommend recovery actions.'
    },
    {
      title: 'Real-Time Proposal Generation',
      description: 'Draft a tailored proposal using AI assistance.'
    },
    {
      title: 'Personalized Video Summaries',
      description: 'Generate a short video recap after calls.'
    },
    {
      title: 'Cross-Channel Outreach',
      description: 'Build multi-step sequences across email and social.'
    },
    {
      title: 'Churn Prediction',
      description: 'Score existing customers for churn risk.'
    },
    {
      title: 'Competitor Monitoring',
      description: 'Track competitor news and log action tips.'
    },
    {
      title: 'AI-Driven Sales Playbooks',
      description: 'Generate playbooks with best tactics and collateral.'
    },
    {
      title: 'Voice-Tone Analysis',
      description: 'Evaluate call recordings and give coaching advice.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Automation Library</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-lg mb-4">
          Choose an automation to perform common CRM tasks with AI assistance.
        </p>

        <div className="grid gap-6 mt-8">
          {automations.map((auto) => (
            <div key={auto.title} className="border rounded-lg p-6 bg-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">{auto.title}</h2>
                <p className="text-sm text-gray-700">{auto.description}</p>
              </div>
              <AutomateButton className="px-3 py-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadAutomation;