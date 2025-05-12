import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Icon component declarations
  const AlertTriangleIcon = getIcon("AlertTriangle");
  const ArrowLeftIcon = getIcon("ArrowLeft");
  const HomeIcon = getIcon("Home");
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
    >
      <div className="max-w-md w-full mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500"
        >
          <AlertTriangleIcon className="w-12 h-12" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-surface-900 dark:text-surface-50"
        >
          404
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl font-medium mb-2 text-surface-800 dark:text-surface-200"
        >
          Page Not Found
        </motion.p>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-surface-600 dark:text-surface-400 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/"
            className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center text-surface-500 dark:text-surface-400 text-sm"
      >
        <p>TaskTamer &copy; {new Date().getFullYear()}</p>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;