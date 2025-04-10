import React, { ReactNode, useState } from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search, 
  LogOut, 
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 dark:text-gray-400 mr-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <Link to="/dashboard" className="flex items-center">
              <div className="text-blue-600 dark:text-blue-500">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">AppName</span>
            </Link>
          </div>
          
          {/* Right side - Search, notifications, profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:placeholder:text-gray-400" 
              />
              <Search size={16} className="absolute left-3 text-gray-400" />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  U
                </div>
                <ChevronDown size={16} className="ml-1 text-gray-500 dark:text-gray-400" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <Link 
                    to="/help" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Help Center
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile (overlay) */}
        <div 
          className={`fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        
        {/* Sidebar - Mobile */}
        <div 
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transition-transform ease-in-out duration-300 transform lg:hidden ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center">
              <div className="text-blue-600 dark:text-blue-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">AppName</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 bg-white dark:bg-gray-800">
            {renderNavItems()}
          </nav>
        </div>
        
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:flex-shrink-0 lg:w-64">
          <div className="h-full flex flex-col border-r dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Desktop Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
              {renderNavItems()}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
  
  // Helper to render navigation items to avoid duplicating the same items in mobile and desktop
  function renderNavItems() {
    const navItems = [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/users", label: "Users", icon: Users },
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/help", label: "Help Center", icon: HelpCircle },
    ];
    
    return (
      <>
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <item.icon size={20} className="mr-3 text-gray-500 dark:text-gray-400" />
            {item.label}
          </Link>
        ))}
      </>
    );
  }
};

export default DashboardLayout;