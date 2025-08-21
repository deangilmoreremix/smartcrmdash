import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { auth } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
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

    const initializeAuth = async () => {
      // Get initial user
      try {
        const { data: { user } } = await auth.getUser();
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Failed to get user:', error);
        setLoading(false);
      }

      // Listen for auth changes
      try {
        const { data: { subscription: authSubscription } } = await auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );
        subscription = authSubscription;
      } catch (error) {
        console.error('Failed to setup auth state change listener:', error);
      }
    };

    initializeAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [])

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password)
    return result
  }

  const signUp = async (email: string, password: string) => {
    const result = await auth.signUp(email, password)
    return result
  }

  const signOut = async () => {
    await auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}