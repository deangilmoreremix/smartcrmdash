
export const checkEnvironment = () => {
  console.log('🔍 Environment Check:');
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('MODE:', import.meta.env.MODE);
  console.log('VITE_CLERK_PUBLISHABLE_KEY:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 30) + '...');
  console.log('VITE_PRODUCTION_MODE:', import.meta.env.VITE_PRODUCTION_MODE);
  console.log('VITE_FORCE_DEVELOPMENT:', import.meta.env.VITE_FORCE_DEVELOPMENT);
  console.log('Current URL:', window.location.href);
  console.log('Origin:', window.location.origin);
  
  const hasValidKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');
  console.log('✅ Valid Clerk Key:', hasValidKey);
  
  return {
    isValid: hasValidKey,
    environment: import.meta.env.NODE_ENV,
    domain: window.location.origin
  };
};

export const forceDevMode = () => {
  if (window.location.hostname.includes('replit')) {
    console.log('🔧 Replit detected - forcing development mode');
    return true;
  }
  return false;
};
