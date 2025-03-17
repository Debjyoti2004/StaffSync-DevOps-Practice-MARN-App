import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const logoAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  const linkAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.nav 
          className="flex justify-between items-center h-16"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={logoAnimation}>
            <NavLink to="/" className="flex items-center group">
              <motion.span 
                className="ml-3 text-xl font-semibold text-gray-100 transition-colors duration-300 group-hover:text-purple-400"
                whileHover={{ scale: 1.05 }}
              >
                StaffSync
              </motion.span>
            </NavLink>
          </motion.div>
          
          <div className="flex space-x-4">
            <motion.div variants={linkAnimation} custom={0}>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-purple-300'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </motion.div>
            
            <motion.div variants={linkAnimation} custom={1}>
              <NavLink 
                to="/create" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-800 text-purple-300 hover:bg-purple-900 hover:text-purple-100'
                  }`
                }
              >
                Add Employee
              </NavLink>
            </motion.div>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}