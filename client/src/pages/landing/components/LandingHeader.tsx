import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X, ChevronDown } from 'lucide-react';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  
  // Track scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Smart<span className="text-gray-900">CRM</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setFeaturesOpen(!featuresOpen)}
                onBlur={() => setTimeout(() => setFeaturesOpen(false), 200)}
              >
                Features <ChevronDown size={16} className={`ml-1 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {featuresOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 p-4 w-[580px] z-[100]">
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/features/ai-tools" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      AI Sales Tools
                    </Link>
                    <Link to="/features/contacts" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      Contact Management
                    </Link>
                    <Link to="/features/pipeline" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      Deal Pipeline
                    </Link>
                    <Link to="/features/ai-assistant" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      AI Assistant
                    </Link>
                    <Link to="/features/vision-analyzer" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      Vision Analyzer
                    </Link>
                    <Link to="/features/image-generator" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      Image Generator
                    </Link>
                    <Link to="/features/function-assistant" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      Function Assistant
                    </Link>
                    <Link to="/features/speech-to-text" className="p-2 hover:bg-gray-50 rounded-md text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                      Speech to Text
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <HashLink smooth to="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </HashLink>
            <Link to="/voice-profiles" className="text-gray-700 hover:text-blue-600 transition-colors">
              Voice Profiles
            </Link>
            <HashLink smooth to="/#faq" className="text-gray-700 hover:text-blue-600 transition-colors">
              FAQ
            </HashLink>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link 
              to="/dev" 
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              🚀 Dashboard
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 relative z-[60]">
            <nav className="flex flex-col space-y-2 pt-4">
              <Link to="/features/ai-tools" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                AI Sales Tools
              </Link>
              <Link to="/features/contacts" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                Contact Management
              </Link>
              <Link to="/features/pipeline" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                Deal Pipeline
              </Link>
              <HashLink smooth to="/#pricing" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                Pricing
              </HashLink>
              <HashLink smooth to="/#faq" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                FAQ
              </HashLink>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg w-fit"
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
