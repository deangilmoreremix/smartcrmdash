import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, options?: any) => Promise<any>
  signOut: () => Promise<void>
  login: (user: User, session?: any) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription: any = null;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      // Set a timeout to prevent indefinite loading
      timeoutId = setTimeout(() => {
        console.log('Auth initialization timeout, setting loading to false');
        setLoading(false);
      }, 5000);

      try {
        // Get initial user
        const { data: { user } } = await auth.getUser();
        setUser(user);
        setLoading(false);
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Failed to get user:', error);
        setUser(null);
        setLoading(false);
        clearTimeout(timeoutId);
      }

      // Listen for auth changes
      try {
        const { data: { subscription: authSubscription } } = await auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state change:', event, session?.user?.id);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );
        subscription = authSubscription;
      } catch (error) {
        console.error('Failed to setup auth state change listener:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password)
    return result
  }

  const signUp = async (email: string, password: string, options?: any) => {
    const result = await auth.signUp(email, password, options)
    return result
  }

  const signOut = async () => {
    await auth.signOut()
  }

  const login = (user: User, session?: any) => {
    setUser(user)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    login
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}