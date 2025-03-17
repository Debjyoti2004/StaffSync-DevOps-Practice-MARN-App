import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [errors, setErrors] = useState({}); 
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  function updateForm(value) {

    if (Object.keys(value)[0] in errors) {
      setErrors((prev) => ({
        ...prev,
        [Object.keys(value)[0]]: null,
      }));
    }
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }


  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!form.position.trim()) {
      newErrors.position = "Job title is required";
    }
    if (!form.level) {
      newErrors.level = "Experience level is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  async function onSubmit(e) {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return; 
    }

    const person = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    } catch (error) {
      console.error("A problem occurred adding or updating a record: ", error);
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="py-6 mx-auto max-w-4xl"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h3
        className="mb-6 text-xl font-medium text-gray-100"
        variants={slideUp}
      >
        {isNew ? "Add New Employee" : "Update Employee Information"}
      </motion.h3>
      <motion.form
        onSubmit={onSubmit}
        className="overflow-hidden bg-gray-800 rounded-lg border border-gray-700 shadow-lg"
        variants={slideUp}
      >
        <div className="px-6 py-5 border-b border-gray-700">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-100">
                Personnel Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Enter the employee's details for company records and team management.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 max-w-2xl">
              <motion.div
                className="sm:col-span-4"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-200"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <div
                    className={`flex rounded-md ring-1 ring-inset ${
                      errors.name ? "ring-red-500" : "ring-gray-600"
                    } shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 sm:max-w-md`}
                  >
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className={`block flex-1 border-0 ${
                        errors.name ? "bg-red-900/20" : "bg-gray-700"
                      } py-1.5 px-3 text-gray-100 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6 rounded-md transition-colors duration-300`}
                      placeholder="Enter employee's full name"
                      value={form.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="sm:col-span-4"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="position"
                  className="block text-sm font-medium leading-6 text-gray-200"
                >
                  Job Title
                </label>
                <div className="mt-2">
                  <div
                    className={`flex rounded-md ring-1 ring-inset ${
                      errors.position ? "ring-red-500" : "ring-gray-600"
                    } shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 sm:max-w-md`}
                  >
                    <input
                      type="text"
                      name="position"
                      id="position"
                      className={`block flex-1 border-0 ${
                        errors.position ? "bg-red-900/20" : "bg-gray-700"
                      } py-1.5 px-3 text-gray-100 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6 rounded-md transition-colors duration-300`}
                      placeholder="Enter job title"
                      value={form.position}
                      onChange={(e) => updateForm({ position: e.target.value })}
                    />
                  </div>
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-400">{errors.position}</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <fieldset className="mt-2">
                  <legend className="mb-2 text-sm font-medium text-gray-200">
                    Experience Level
                  </legend>
                  <div
                    className={`p-3 rounded-md ${
                      errors.level ? "bg-red-900/20 ring-1 ring-red-500" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input
                          id="positionIntern"
                          name="positionOptions"
                          type="radio"
                          value="Intern"
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 cursor-pointer focus:ring-purple-500 focus:ring-offset-gray-800"
                          checked={form.level === "Intern"}
                          onChange={(e) => updateForm({ level: e.target.value })}
                        />
                        <label
                          htmlFor="positionIntern"
                          className="ml-3 text-sm font-medium leading-6 text-gray-200"
                        >
                          Intern
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="positionJunior"
                          name="positionOptions"
                          type="radio"
                          value="Junior"
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 cursor-pointer focus:ring-purple-500 focus:ring-offset-gray-800"
                          checked={form.level === "Junior"}
                          onChange={(e) => updateForm({ level: e.target.value })}
                        />
                        <label
                          htmlFor="positionJunior"
                          className="ml-3 text-sm font-medium leading-6 text-gray-200"
                        >
                          Junior
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="positionSenior"
                          name="positionOptions"
                          type="radio"
                          value="Senior"
                          className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 cursor-pointer focus:ring-purple-500 focus:ring-offset-gray-800"
                          checked={form.level === "Senior"}
                          onChange={(e) => updateForm({ level: e.target.value })}
                        />
                        <label
                          htmlFor="positionSenior"
                          className="ml-3 text-sm font-medium leading-6 text-gray-200"
                        >
                          Senior
                        </label>
                      </div>
                    </div>
                  </div>
                  {errors.level && (
                    <p className="mt-1 text-sm text-red-400">{errors.level}</p>
                  )}
                </fieldset>
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div
          className="flex justify-end px-6 py-4 bg-gray-900 border-t border-gray-700"
          variants={slideUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <motion.button
            type="submit"
            className="inline-flex justify-center items-center px-4 py-2 font-medium text-white bg-purple-600 rounded-md border border-transparent shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isNew ? "Create Employee Record" : "Update Employee Record"}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}