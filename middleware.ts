import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/contacts(.*)',
  '/pipeline(.*)',
  '/tasks(.*)',
  '/white-label(.*)',
  '/settings(.*)',
  '/ai-tools(.*)',
  '/sales-tools(.*)',
  '/marketing-tools(.*)',
  '/content-management(.*)',
  '/admin(.*)'
]);

// Define admin routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/master-admin(.*)'
]);

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/public(.*)'
]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, orgRole } = auth();
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated
  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }

  // Check admin access
  if (isAdminRoute(req)) {
    const userEmail = auth().user?.emailAddresses?.[0]?.emailAddress;
    const isMasterAdmin = userEmail === process.env.MASTER_ADMIN_EMAIL;
    
    if (!isMasterAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Check organization membership for protected routes
  if (isProtectedRoute(req) && !orgId) {
    // Redirect to organization selection or creation
    return NextResponse.redirect(new URL('/select-org', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
