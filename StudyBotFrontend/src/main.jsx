import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './contexts/';
import { TasksProvider } from './contexts/';
// import { UserTaskProvider } from './contexts/';
import './App.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
    <UserProvider>
      <TasksProvider>
        {/* <UserTaskProvider> */}
          <App />
        {/* </UserTaskProvider> */}
      </TasksProvider>
    </UserProvider>
  </React.StrictMode>
);
