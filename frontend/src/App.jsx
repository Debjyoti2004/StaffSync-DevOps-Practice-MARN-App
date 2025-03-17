import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { motion } from "framer-motion";

const App = () => {
  return (
    <motion.div 
      className="w-full min-h-screen text-gray-100 bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main className="p-6 pt-2 w-full">
        <Outlet />
      </main>
    </motion.div>
  );
};

export default App;