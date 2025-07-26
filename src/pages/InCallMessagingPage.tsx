import React from 'react';
import InCallMessaging from '../components/InCallMessaging';

const InCallMessagingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">In-Call Messaging</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <InCallMessaging 
            isVisible={true}
            onClose={() => {}}
            remoteParticipantName="Demo Participant"
          />
        </div>
      </div>
    </div>
  );
};

export default InCallMessagingPage;
