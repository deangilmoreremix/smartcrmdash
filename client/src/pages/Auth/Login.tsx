import React from 'react';
import { useTheme } from '@contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    } flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          } mb-2`}>
            Smart CRM
          </h1>
          <p className={`${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your account
          </p>
        </div>
        
        <Card className={`${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-lg`}>
          <CardHeader>
            <CardTitle className={`text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={`flex items-center ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={`flex items-center ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  <Lock className="h-4 w-4 mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between">
                <Link 
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </form>
            {/* Development Bypass Button */}
            <div className="mt-4">
              <Link to="/dev-bypass">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900"
                >
                  🚀 Development Bypass Login
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link 
                  to="/signup"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;