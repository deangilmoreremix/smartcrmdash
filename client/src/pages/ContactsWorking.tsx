import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ModuleFederationContacts from '../components/ModuleFederationContacts';

const ContactsWorking: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="w-full overflow-hidden relative" style={{ height: 'calc(100vh - 80px)', paddingTop: '60px' }}>
      {/* Full Screen Contacts Component */}
      <div className="h-full w-full">
        <ModuleFederationContacts showHeader={false} />
      </div>
    </div>
  );
};

export default ContactsWorking;