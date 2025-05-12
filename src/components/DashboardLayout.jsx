
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const DashboardLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Segments", path: "/segments" },
    { name: "Campaigns", path: "/campaigns" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-brand-primary">
                Xeno CRM
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium ${
                    location.pathname === link.path
                      ? "text-brand-primary"
                      : "text-gray-600 hover:text-brand-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center">
              {/* User Profile */}
              <div className="hidden md:flex items-center">
                {currentUser && (
                  <div className="flex items-center">
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-sm font-medium mr-4">
                      {currentUser.name}
                    </span>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Log Out
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-2 py-1 rounded ${
                      location.pathname === link.path
                        ? "bg-brand-accent text-brand-primary"
                        : "text-gray-600"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {currentUser && (
                  <div className="pt-3 border-t mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span className="text-sm font-medium">
                        {currentUser.name}
                      </span>
                    </div>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      size="sm"
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 text-center">
            © 2025 Xeno CRM Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
