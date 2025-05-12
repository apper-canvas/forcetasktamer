import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

const MainFeature = () => {
  // Icon component declarations
  const PlusIcon = getIcon("Plus");
  const TrashIcon = getIcon("Trash2");
  const CheckIcon = getIcon("Check");
  const CircleIcon = getIcon("Circle");
  const XIcon = getIcon("X");
  const EditIcon = getIcon("Edit");
  const AlarmIcon = getIcon("Bell");
  const FlagIcon = getIcon("Flag");
  const CalendarIcon = getIcon("Calendar");
  const ClockIcon = getIcon("Clock");
  const FilterIcon = getIcon("Filter");
  const SortIcon = getIcon("ArrowUpDown");
  const ChevronDownIcon = getIcon("ChevronDown");
  const FolderIcon = getIcon("Folder");
  const XCircleIcon = getIcon("XCircle");

  // State for tasks
  const [tasks, setTasks] = useState(() => {
    // Load from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Failed to parse saved tasks:", e);
      }
    }
    
    // Default tasks
    return [
      { 
        id: '1', 
        title: 'Complete project proposal', 
        completed: false, 
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        priority: 'high',
        category: 'work',
        projectId: '2'
      },
      { 
        id: '2', 
        title: 'Buy groceries', 
        completed: false, 
        createdAt: new Date().toISOString(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        priority: 'medium',
        category: 'personal',
        projectId: '1'
      },
      { 
        id: '3', 
        title: 'Go for a run', 
        completed: true, 
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        priority: 'low',
        category: 'health',
        projectId: '1'
      }
    ];
  });

  const projects = useSelector(state => state.projects.list);

  // State for new task form
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    category: 'personal'
  });
  
  // UI states
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewTaskId, setViewTaskId] = useState(null);
  const [sortOption, setSortOption] = useState('dueDate');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [projectFilterMenuOpen, setProjectFilterMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [categoryColors] = useState({
    work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    personal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    health: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    finance: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  });
  const [projectColors] = useState({
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  });
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Add or update a task
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }

    if (editingTaskId) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTaskId ? 
          { 
            ...task, 
            title: newTask.title,
            dueDate: new Date(`${newTask.dueDate}T12:00:00`).toISOString(),
            priority: newTask.priority,
            category: newTask.category,
            projectId: newTask.projectId
          } : task
      ));
      
      setEditingTaskId(null);
      toast.success("Task updated");
    } else {
      // Add new task
      const newTaskObj = {
        id: Date.now().toString(),
        title: newTask.title,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: new Date(`${newTask.dueDate}T12:00:00`).toISOString(),
        priority: newTask.priority,
        category: newTask.category,
        projectId: newTask.projectId || '1' // Default to first project if none selected
      };
      
      setTasks([...tasks, newTaskObj]);
      toast.success("Task added");
    }
    
    // Reset form
    setNewTask({
      title: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'medium',
      category: 'personal',
      projectId: '1'
    });
    
    setIsFormVisible(false);
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.info(task.completed ? "Task marked as incomplete" : "Task completed!", {
        icon: task.completed ? "🔄" : "✅"
      });
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  // Edit a task
  const startEditing = (task) => {
    if (viewTaskId) {
      setViewTaskId(null);
    }
    
    // Set up form with task data
    setNewTask({
      title: task.title,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      priority: task.priority,
      category: task.category || 'personal',
      projectId: task.projectId || '1'
    });
    
    setEditingTaskId(task.id);
    setIsFormVisible(true);
  };
  
  // View a task (open edit modal)
  const viewTask = (task) => {
    setViewTaskId(task.id);
    setIsFormVisible(false);
  };

  // Filter tasks based on current filter
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'today':
        filtered = filtered.filter(task => isToday(new Date(task.dueDate)));
        break;
      case 'tomorrow':
        filtered = filtered.filter(task => isTomorrow(new Date(task.dueDate)));
        break;
      case 'overdue':
        filtered = filtered.filter(task => !task.completed && isPast(new Date(task.dueDate)));
        break;
      // Project filtering
      case 'project':
        if (filter.startsWith('project:')) {
          const projectId = filter.split(':')[1];
          filtered = filtered.filter(task => task.projectId === projectId);
        }
        break;
      // Priority filtering
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      default:
        break;
    }
    
    // Sort tasks
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'creation':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });
  };

  const handleFilterSelect = (selectedFilter) => {
    setFilter(selectedFilter);
    setFilterMenuOpen(false);
    toast.info(`Showing ${selectedFilter} tasks`);
  };

  const handleProjectFilterSelect = (projectId) => {
    const projectName = projects.find(p => p.id === projectId)?.name || 'Unknown';
    setFilter(`project:${projectId}`);
    setProjectFilterMenuOpen(false);
    toast.info(`Showing ${projectName} project tasks`);
  };

  const handleSortSelect = (selectedSort) => {
    setSortOption(selectedSort);
    setSortMenuOpen(false);
    toast.info(`Sorted by ${selectedSort}`);
  };

  // Function to get appropriate classes for due date display
  const getDueDateClasses = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return "text-red-600 dark:text-red-400";
    }
    if (isToday(date)) {
      return "text-orange-600 dark:text-orange-400";
    }
    if (isTomorrow(date)) {
      return "text-yellow-600 dark:text-yellow-400";
    }
    return "text-surface-600 dark:text-surface-400";
  };

  // Function to get priority icon and classes
  const getPriorityElements = (priority) => {
    const classes = {
      high: "text-red-500",
      medium: "text-yellow-500",
      low: "text-green-500"
    };
    return {
      className: classes[priority] || classes.medium
    };
  };
  
  // Function to get project by id
  const getProject = (projectId) => {
    return projects.find(p => p.id === projectId) || { 
      id: 'default', 
      name: 'No Project', 
      color: 'default' 
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    },
    exit: { 
      y: -10, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    },
    exit: { 
      y: 20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // EditTaskModal component
  const EditTaskModal = ({ task, onClose, onSave }) => {
    const [editedTask, setEditedTask] = useState({
      title: task.title,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      priority: task.priority,
      category: task.category || 'personal',
      projectId: task.projectId || '1'
    });

    // Handle input changes within the modal
    const handleModalInputChange = (e) => {
      const { name, value } = e.target;
      setEditedTask(prev => ({ ...prev, [name]: value }));
    };

    // Handle save button click
    const handleModalSave = (e) => {
      e.preventDefault();
      
      if (!editedTask.title.trim()) {
        toast.error("Task title cannot be empty");
        return;
      }
      
      // Create updated task object
      const updatedTask = {
        ...task,
        title: editedTask.title,
        dueDate: new Date(`${editedTask.dueDate}T12:00:00`).toISOString(),
        priority: editedTask.priority,
        category: editedTask.category,
        projectId: editedTask.projectId
      };
      
      onSave(updatedTask);
      onClose();
    };

    // Close modal when Escape key is pressed
    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEsc);
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }, [onClose]);

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <form onSubmit={handleModalSave} className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Edit Task</h2>
              <button type="button" onClick={onClose} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label htmlFor="modal-title" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                Task Title
              </label>
              <input
                type="text"
                id="modal-title"
                name="title"
                value={editedTask.title}
                onChange={handleModalInputChange}
                className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="modal-field-container">
                {/* Same fields as original form but with different IDs and onChange handler */}
                <label htmlFor="modal-dueDate" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                  Due Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="date"
                    id="modal-dueDate"
                    name="dueDate"
                    value={editedTask.dueDate}
                    onChange={handleModalInputChange}
                    className="w-full p-3 pl-10 border border-surface-300 dark:border-surface-600 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="modal-field-container">
                <label htmlFor="modal-priority" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                  Priority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                    <FlagIcon className="w-5 h-5" />
                  </div>
                  <select
                    id="modal-priority"
                    name="priority"
                    value={editedTask.priority}
                    onChange={handleModalInputChange}
                    className="w-full p-3 pl-10 border border-surface-300 dark:border-surface-600 rounded-lg appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-field-container">
                <label htmlFor="modal-category" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                  Category
                </label>
                <select
                  id="modal-category"
                  value={editedTask.category}
                  onChange={handleModalInputChange}
                  className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="modal-field-container">
                <label htmlFor="modal-project" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                  Project</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                    <FolderIcon className="w-5 h-5" />
                  </div>
                  <select
                    id="modal-project"
                    name="projectId"
                    value={editedTask.projectId || ''}
                    onChange={handleModalInputChange}
                    className="w-full p-3 pl-10 border border-surface-300 dark:border-surface-600 rounded-lg appearance-none"
                  >
                    {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                  </select>
                </div>
              </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress overview */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="card p-5 flex flex-col">
          <h3 className="text-lg font-medium mb-2 text-surface-700 dark:text-surface-300">Total Tasks</h3>
          <p className="text-3xl font-bold text-primary">{totalTasks}</p>
        </div>
        
        <div className="card p-5 flex flex-col">
          <h3 className="text-lg font-medium mb-2 text-surface-700 dark:text-surface-300">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{completedCount}</p>
        </div>
        
        <div className="card p-5 flex flex-col">
          <h3 className="text-lg font-medium mb-2 text-surface-700 dark:text-surface-300">Progress</h3>
          <div className="flex items-center gap-3">
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{completionPercentage}%</span>
          </div>
        </div>
      </motion.div>

      {/* Controls section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 order-2 sm:order-1">
          {/* Filter dropdown */}
          <div className="relative">
            <button 
              className="btn btn-outline flex items-center gap-2"
              onClick={() => setProjectFilterMenuOpen(!projectFilterMenuOpen)}
            >
              <FolderIcon className="w-4 h-4" />
              <span>
                {filter.startsWith('project:') 
                  ? getProject(filter.split(':')[1]).name
                  : 'All Projects'}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {projectFilterMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 z-10"
              >
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors
                            ${filter === 'all' ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
                  onClick={() => handleFilterSelect('all')}
                >
                  All Projects
                </button>
                {projects.map(project => (
                  <button
                    key={project.id}
                    className={`w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center gap-2
                              ${filter === `project:${project.id}` ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
                    onClick={() => handleProjectFilterSelect(project.id)}
                  >
                    <span className={`w-3 h-3 rounded-full ${projectColors[project.color] || projectColors.default}`}></span>
                    {project.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          <div className="relative">
            <button 
              className="btn btn-outline flex items-center gap-2"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <FilterIcon className="w-4 h-4" />
              <span className="capitalize">{filter === 'all' ? 'All Tasks' : filter}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {filterMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 z-10"
              >
                {['all', 'active', 'completed', 'today', 'tomorrow', 'overdue', 'high'].map(option => (
                  <button
                    key={option}
                    className={`w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors
                              ${filter === option ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
                    onClick={() => handleFilterSelect(option)}
                  >
                    {option === 'all' ? 'All Tasks' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          
          {/* Sort dropdown */}
          <div className="relative">
            <button 
              className="btn btn-outline flex items-center gap-2"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
              <SortIcon className="w-4 h-4" />
              <span className="capitalize hidden sm:inline">
                {sortOption === 'dueDate' ? 'Due Date' : 
                 sortOption === 'alphabetical' ? 'A-Z' :
                 sortOption === 'creation' ? 'Created' : 'Priority'}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {sortMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 z-10"
              >
                {[
                  { value: 'dueDate', label: 'Due Date' },
                  { value: 'priority', label: 'Priority' },
                  { value: 'alphabetical', label: 'Alphabetical' },
                  { value: 'creation', label: 'Creation Date' }
                ].map(option => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors
                              ${sortOption === option.value ? 'bg-primary/10 text-primary dark:bg-primary/20' : ''}`}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        
        <button 
          className="btn btn-primary flex items-center gap-2 order-1 sm:order-2"
          onClick={() => {
            setEditingTaskId(null);
            setNewTask({
              title: '',
              dueDate: format(new Date(), 'yyyy-MM-dd'),
              priority: 'medium',
              category: 'personal',
              projectId: '1'
            });
            setIsFormVisible(!isFormVisible);
          }}
        >
          {isFormVisible ? (
            <>
              <XIcon className="w-5 h-5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              <span>New Task</span>
            </>
          )}
        </button>
      </div>

      {/* Task form */}
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-8"
          >
            <form onSubmit={handleSubmit} className="card p-6">
              <h2 className="text-xl font-semibold mb-4 text-surface-800 dark:text-surface-100">
                {editingTaskId ? 'Edit Task' : 'Add New Task'}
              </h2>
              
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="What needs to be done?"
                  className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg"
                  autoFocus
                />
              </div>
              
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                    Due Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-surface-300 dark:border-surface-600 rounded-lg"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                    Priority
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                      <FlagIcon className="w-5 h-5" />
                    </div>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-surface-300 dark:border-surface-600 rounded-lg appearance-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newTask.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-surface-300 dark:border-surface-600 rounded-lg"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

            <div className="mb-6">
              <label htmlFor="project" className="block mb-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                Project
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                  <FolderIcon className="w-5 h-5" />
                </div>
                <select
                  id="project"
                  name="projectId"
                  value={newTask.projectId || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 border border-surface-300 dark:border-surface-600 rounded-lg appearance-none"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                Assign this task to a project to organize your work
              </p>
            </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task list */}
      {filteredTasks.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card overflow-hidden"
        >
          <div className="bg-surface-100 dark:bg-surface-800 py-3 px-4 border-b border-surface-200 dark:border-surface-700">
            <h2 className="font-medium text-surface-800 dark:text-surface-200">
              {filter === 'all' ? 'All Tasks' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Tasks'}
              <span className="ml-2 text-sm text-surface-500 dark:text-surface-400">({filteredTasks.length})</span>
            </h2>
          </div>
          
          <AnimatePresence>
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`p-4 sm:p-5 flex items-start gap-3 group ${task.completed ? 'bg-surface-50 dark:bg-surface-800/50' : ''} cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700`}
                  onClick={() => viewTask(task)}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(task.id);
                    }}
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors
                               border-2 ${task.completed ? 
                                'bg-primary border-primary text-white' : 
                                'border-surface-300 dark:border-surface-600 hover:border-primary hover:bg-surface-100'}`}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed && <CheckIcon className="w-4 h-4" />}
                  </button>
                  
                  {/* Task content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-surface-500 dark:text-surface-500' : 'text-surface-800 dark:text-surface-100'}`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 sm:ml-auto">
                        {/* Priority indicator */}
                        <span className={`text-sm flex items-center gap-1 ${getPriorityElements(task.priority).className}`}>
                          <FlagIcon className="w-4 h-4" />
                          <span className="hidden sm:inline capitalize">{task.priority}</span>
                        </span>
                        
                        {/* Category tag */}
                        <span className={`text-sm px-2 py-1 rounded-full ${categoryColors[task.category] || categoryColors.other} mr-1`}>
                          {task.category}
                        </span>
                        
                        {/* Project tag */}
                        {task.projectId && (
                          <span className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${projectColors[getProject(task.projectId).color] || projectColors.default}`}>
                            <FolderIcon className="w-3 h-3" />
                            {getProject(task.projectId).name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Due date */}
                    <div className={`flex items-center text-sm ${getDueDateClasses(task.dueDate)}`}>
                      <CalendarIcon className="w-4 h-4 mr-1.5" />
                      <span>
                        {isToday(new Date(task.dueDate)) 
                          ? 'Today' 
                          : isTomorrow(new Date(task.dueDate))
                            ? 'Tomorrow'
                            : format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                      
                      {isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed && (
                        <span className="ml-2 text-red-500 font-medium">Overdue</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(task);
                      }}
                      className="p-2 text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                      aria-label="Edit task"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="p-2 text-surface-500 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                      aria-label="Delete task"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12 px-4 card"
        >
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardIcon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-surface-800 dark:text-surface-200">No tasks found</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              {filter === 'all' ? 
                "You don't have any tasks yet. Create your first task to get started!" : 
                `No ${filter} tasks. Try a different filter or create a new task.`}
            </p>
            <button 
              onClick={() => {
                setEditingTaskId(null);
                setNewTask({
                  title: '',
                                  dueDate: format(new Date(), 'yyyy-MM-dd'),  
                                  projectId: '1',
                  priority: 'medium',
                  category: 'personal'
                });
                setIsFormVisible(true);
              }}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create New Task</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Task Edit Modal */}
      <AnimatePresence>
        {viewTaskId && (
          <EditTaskModal 
            task={tasks.find(t => t.id === viewTaskId)} 
            onClose={() => setViewTaskId(null)}
            onSave={(updatedTask) => {
              setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            }}
          />

        )}
      </AnimatePresence>
    </div>
  );
};

// Additional icon component
const ClipboardIcon = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <path d="M12 11h4"></path>
      <path d="M12 16h4"></path>
      <path d="M8 11h.01"></path>
      <path d="M8 16h.01"></path>
    </svg>
  );
};

export default MainFeature;