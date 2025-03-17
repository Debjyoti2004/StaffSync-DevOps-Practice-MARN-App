import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Record = (props) => {
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.tr 
      className="border-b border-gray-700 transition-colors hover:bg-gray-700/50"
      variants={rowVariants}
    >
      <td className="p-4 font-medium text-gray-100 align-middle">
        {props.record.name}
      </td>
      <td className="p-4 text-gray-300 align-middle">
        {props.record.position}
      </td>
      <td className="p-4 align-middle">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          props.record.level === "Senior" ? "bg-green-900 text-green-200" :
          props.record.level === "Junior" ? "bg-blue-900 text-blue-200" :
          "bg-yellow-900 text-yellow-200"
        }`}>
          {props.record.level}
        </span>
      </td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              className="inline-flex justify-center items-center px-3 h-9 text-sm font-medium text-gray-300 bg-gray-700 rounded-md border border-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 hover:bg-gray-600"
              to={`/edit/${props.record._id}`}
            >
              Edit
            </Link>
          </motion.div>
          <motion.button
            className="inline-flex justify-center items-center px-3 h-9 text-sm font-medium text-white bg-red-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 hover:bg-red-700"
            type="button"
            onClick={() => {
              props.deleteRecord(props.record._id);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };


  useEffect(() => {
    async function getRecords() {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5050/record/`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const records = await response.json();
        setRecords(records);
        setError(null);
      } catch (error) {
        console.error(error.message);
        setError("Failed to fetch employee records. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    getRecords();
  }, [records.length]);

  async function deleteRecord(id) {
    try {
      const response = await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`);
      }
      
      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
        />
      );
    });
  }

  
  return (
    <motion.div 
      className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="mb-6 sm:flex sm:items-center sm:justify-between"
        variants={itemVariants}
      >
      </motion.div>
      
      {error && (
        <motion.div 
          className="px-4 py-3 mb-4 text-red-200 rounded border border-red-800 bg-red-900/50"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}
      
      {isLoading ? (
        <motion.div 
          className="py-12 text-center"
          variants={itemVariants}
        >
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-sm text-gray-400">Loading employee data...</p>
        </motion.div>
      ) : records.length === 0 ? (
        <motion.div 
          className="py-12 text-center bg-gray-800 rounded-lg border border-gray-700"
          variants={itemVariants}
        >
          <p className="text-gray-400">No employee records found</p>
          <Link 
            to="/create"
            className="inline-flex items-center mt-2 text-purple-400 hover:text-purple-300"
          >
            Add your first employee
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="overflow-hidden bg-gray-800 rounded-lg border border-gray-700 shadow-lg"
          variants={itemVariants}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Employee Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <motion.tbody 
                className="bg-gray-800 divide-y divide-gray-700"
                variants={containerVariants}
              >
                {recordList()}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}