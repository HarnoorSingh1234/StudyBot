
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient'; // Assuming you have Supabase set up

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const defaultCourse = 'cpp'; // Default course can be set to 'cpp' or 'python'

  // Check if the user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user); // Set isLoggedIn based on whether there's a logged-in user
    };

    checkLoginStatus();
  }, []);

  // Redirect to login only when trying to access restricted pages without userId
  const handleRestrictedNavigation = (path) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bg-black backdrop-blur-lg shadow-lg p-4 flex items-center justify-between border-b border-gray-700">
      {/* Logo */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent tracking-wide">
        StudyBot
      </h1>

      {/* Centered Links */}
      <ul className="flex items-center space-x-8 mx-auto">
        <li>
          <Link
            to="/"
            className="px-4 py-2 text-gray-200 hover:text-blue-400 hover:border-b-2 border-blue-500 transition duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <button
            onClick={() => handleRestrictedNavigation(`/user/${userId}/dashboard`)}
            className="px-4 py-2 text-gray-200 hover:text-blue-400 hover:border-b-2 border-blue-500 transition duration-300"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => handleRestrictedNavigation(`/user/${userId}/course/${defaultCourse}/results`)}
            className="px-4 py-2 text-gray-200 hover:text-blue-400 hover:border-b-2 border-blue-500 transition duration-300"
          >
            Results
          </button>
        </li>
        <li>
          <Link
            to="/leaderboard"
            className="px-4 py-2 text-gray-200 hover:text-blue-400 hover:border-b-2 border-blue-500 transition duration-300"
          >
            Leaderboard
          </Link>
        </li>
      </ul>

      {/* Conditional rendering for Login/Signup or User Icon */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <Link to="/profile" className="text-gray-200 hover:text-blue-400 transition duration-300">
            <User size={24} />
          </Link>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login">
              <button className="px-4 py-2 border border-white text-gray-200 bg-black hover:text-blue-400 hover:border-blue-500 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 border border-white text-gray-200 bg-black hover:text-blue-400 hover:border-blue-500 transition duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
