import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { username, password });
  };

  return (<>
    
  
    
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-blue-400">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm text-gray-300">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">New user?</span>
          <Link
            to="/signup"
            className="text-sm font-medium text-blue-400 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div></>
  );
}

export default LoginPage;
