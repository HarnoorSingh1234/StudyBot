/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/contexts/TasksContext.js
import { createContext, useState, useEffect } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Example: fetch tasks data from backend
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    };
    
    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
