import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        setError("Signup failed: " + error.message);
      } else {
        // Step 2: Insert additional user data into `userdetails` table
        const { user } = data;
        await supabase
          .from('userdetails')
          .insert([
            { id: user.id, email: user.email, username: username, progress: 0 }
          ]);

        navigate(`/user/${user.id}/dashboard`);
      }
    } catch (error) {
      setError("Signup failed: " + error.message);
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-blue-400">Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
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
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">Already have an account?</span>
          <Link to="/login" className="text-sm font-medium text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
