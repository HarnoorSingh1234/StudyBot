/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/contexts/UserTaskContext.js
import { createContext, useState, useEffect } from 'react';

export const UserTaskContext = createContext();

export const UserTaskProvider = ({ children }) => {
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    // Example: fetch user-specific task data from backend
    const fetchUserTasks = async () => {
      const response = await fetch('/api/user-tasks');
      const data = await response.json();
      setUserTasks(data);
    };
    
    fetchUserTasks();
  }, []);

  return (
    <UserTaskContext.Provider value={{ userTasks, setUserTasks }}>
      {children}
    </UserTaskContext.Provider>
  );
};
