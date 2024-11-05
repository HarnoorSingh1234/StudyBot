import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient';
import { UserContext } from '../contexts/UserContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query the UserDetails table to authenticate user by email and password
      const { data: userData, error: userError } = await supabase
        .from('userdetails')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (userError || !userData) {
        setError("Login failed: Invalid email or password.");
        console.error("Login error:", userError);
        return;
      }

      // Log successful login with timestamp (if you have a UserLoginHistory table)
      const { error: logError } = await supabase.from('UserLoginHistory').insert([
        { user_id: userData.id }
      ]);

      if (logError) {
        console.error("Failed to log login date:", logError);
      }

      // Set the user in context with details from UserDetails table
      setUser(userData);
      navigate(`/user/${userData.id}/dashboard`);

    } catch (error) {
      setError("An error occurred during login.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-blue-400">Log In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
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
            Log In
          </button>
        </form>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">New user?</span>
          <Link to="/signup" className="text-sm font-medium text-blue-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
