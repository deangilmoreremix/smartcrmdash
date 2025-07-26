import React from 'react';
import CallRecording from '../components/CallRecording';

const CallRecordingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Call Recording</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <CallRecording 
            isInCall={false}
            localStream={null}
            remoteStream={null}
          />
        </div>
      </div>
    </div>
  );
};

export default CallRecordingPage;
