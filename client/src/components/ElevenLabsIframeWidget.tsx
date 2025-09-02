import React from 'react';

interface ElevenLabsIframeWidgetProps {
  agentId?: string;
  height?: string;
  width?: string;
}

const ElevenLabsIframeWidget: React.FC<ElevenLabsIframeWidgetProps> = ({
  agentId = 'agent_01jvwktgjsefkts3rv9jqwcx33',
  height = '600px',
  width = '400px'
}) => {
  const widgetUrl = `https://api.elevenlabs.io/v1/convai/agents/${agentId}/widget`;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <iframe
        src={widgetUrl}
        width={width}
        height={height}
        style={{
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
        allow="microphone"
        title="ElevenLabs Voice Assistant"
      />
    </div>
  );
};

export default ElevenLabsIframeWidget;