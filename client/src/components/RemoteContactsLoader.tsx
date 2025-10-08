import React, { Suspense } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

// Lazy load the remote ContactsApp
const RemoteContactsApp = React.lazy(() =>
  import('contacts/ContactsApp')
);

const RemoteContactsLoader: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner message="Loading contacts..." size="lg" />
      </div>
    }>
      <RemoteContactsApp />
    </Suspense>
  );
};

export default RemoteContactsLoader;