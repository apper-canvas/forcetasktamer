import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  // Icon component declarations
  const ChecklistIcon = getIcon("CheckSquare");
  const CalendarIcon = getIcon("Calendar");
  const FilterIcon = getIcon("Filter");
  const SortIcon = getIcon("ArrowUpDown");
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Update date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setFilterOpen(false);
    toast.info(`Showing ${filter} tasks`, {
      position: "bottom-right",
      autoClose: 2000
    });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    toast.info(`Sorted by ${sort}`, {
      position: "bottom-right",
      autoClose: 2000
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <motion.header 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2">
                <ChecklistIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <span>TaskTamer</span>
              </h1>
              <div className="flex items-center mt-2 text-surface-500 dark:text-surface-400">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{format(currentDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <FilterIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  <span className="inline sm:hidden">
                    {activeFilter !== 'all' && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
                    )}
                  </span>
                </button>
                
                {filterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 z-10"
                  >
                    {['all', 'active', 'completed', 'high priority'].map(filter => (
                      <button
                        key={filter}
                        className={`w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors
                                  ${activeFilter === filter ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
                        onClick={() => handleFilterChange(filter)}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              
              <div className="relative">
                <button className="btn btn-outline flex items-center gap-2">
                  <SortIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sort</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.div variants={itemVariants}>
            <MainFeature />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Home;