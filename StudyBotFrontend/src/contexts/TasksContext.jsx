/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/contexts/TasksContext.js
import { createContext, useState }from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  // Define the Python and C++ courses with dummy tasks
  const initialTasks = [
    {
      id: 'python',
      name: 'Python Course',
      tasks: [
        {
          taskId: 1,
          title: 'Python Basics',
          videoLink: 'https://www.example.com/python-basics-video',
          taskPdf: 'https://www.example.com/python-basics-task.pdf',
          optimalSolution: `def add(a, b):\n  return a + b`,
          solutionExplanation: 'This function takes two numbers and returns their sum using simple addition.',
        },
        {
          taskId: 2,
          title: 'Data Structures in Python',
          videoLink: 'https://www.example.com/python-data-structures-video',
          taskPdf: 'https://www.example.com/python-data-structures-task.pdf',
          optimalSolution: `def find_max(arr):\n  return max(arr)`,
          solutionExplanation: 'This function uses the built-in max function to find the maximum value in an array.',
        },
      ],
    },
    {
      id: 'cpp',
      name: 'C++ Course',
      tasks: [
        {
          taskId: 1,
          title: 'C++ Basics',
          videoLink: 'https://www.example.com/cpp-basics-video',
          taskPdf: 'https://www.example.com/cpp-basics-task.pdf',
          optimalSolution: `int add(int a, int b) {\n  return a + b;\n}`,
          solutionExplanation: 'This function takes two integers and returns their sum using simple addition.',
        },
        {
          taskId: 2,
          title: 'Data Structures in C++',
          videoLink: 'https://www.example.com/cpp-data-structures-video',
          taskPdf: 'https://www.example.com/cpp-data-structures-task.pdf',
          optimalSolution: `int findMax(vector<int>& arr) {\n  return *max_element(arr.begin(), arr.end());\n}`,
          solutionExplanation: 'This function uses the STL max_element function to find the maximum value in a vector.',
        },
      ],
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  // No need for useEffect since tasks are pre-defined
  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
