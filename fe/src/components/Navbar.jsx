import React, { useCallback, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logoutApi } from '../utils/api';


const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logoutApi();
    navigate('/login');
  }, [navigate]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">SocialApp</span>
          </div>
          <div className="md:hidden">
            <button className="text-white focus:outline-none focus:text-white" onClick={toggleMenu}>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            {isOpen && (
              <div className="absolute top-16 right-0 bg-gray-800 py-2 px-4 rounded-md shadow-lg">
                <button className="text-white" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
