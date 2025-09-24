import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import appRoutes from '../../routes/appRoutes';

interface BreadcrumbsProps {
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();
  const { pathname } = location;
  
  // Find all matching routes for the current path to build breadcrumbs
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ path: '/', breadcrumb: 'Home' }];
    
    // Get breadcrumb for current path
    const currentRoute = appRoutes.find((route: { path: string, breadcrumb?: string }) => route.path === pathname);
    if (currentRoute?.breadcrumb) {
      breadcrumbs.push({
        path: currentRoute.path,
        breadcrumb: currentRoute.breadcrumb
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't render breadcrumbs for the home page
  if (pathname === '/' || pathname === '/dashboard') {
    return null;
  }

  return (
    <div className={`flex items-center text-sm py-2 px-4 ${className}`}>
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && <ChevronRight className="mx-2 w-4 h-4 opacity-50" />}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-600 dark:text-gray-400 font-medium">{breadcrumb.breadcrumb}</span>
          ) : (
            <Link 
              to={breadcrumb.path}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              {breadcrumb.breadcrumb}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
