import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LinkRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.startsWith('#/')) {
      const path = hash.substring(1);
      navigate(path, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default LinkRedirect;
