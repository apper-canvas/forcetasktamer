import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    toast.info(
      darkMode ? "Light mode activated" : "Dark mode activated", 
      { 
        icon: darkMode ? "☀️" : "🌙",
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    );
  };

  // Icon component declarations
  const ThemeIcon = getIcon(darkMode ? "Sun" : "Moon");

  return (
    <div className="min-h-screen relative">
      {/* Theme toggle button */}
      <button 
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface-200 dark:bg-surface-700 
                  shadow-soft hover:shadow-md transition-all duration-300 hover:scale-105"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <ThemeIcon className="w-5 h-5" />
      </button>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {/* Toast notifications container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-safe-bottom md:mr-safe-right"
        toastClassName="rounded-xl shadow-lg"
        bodyClassName="text-sm font-medium"
      />
    </div>
  );
}

export default App;