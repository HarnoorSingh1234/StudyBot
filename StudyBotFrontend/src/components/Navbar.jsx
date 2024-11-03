/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function Navbar() {
  // Placeholder state for whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { userId } = useParams();
  const defaultCourse = 'cpp'; // Default course can be set to 'cpp' or 'python'

  return (
    <nav className="bg-black backdrop-blur-lg shadow-lg p-4 flex items-center justify-between border-b border-gray-700">
      {/* Logo */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent tracking-wide">
        StudyBot
      </h1>

      {/* Centered Links */}
      <ul className="flex space-x-6 mx-auto">
        <li>
          <Link
            to="/"
            className="px-4 py-2 border border-white text-gray-200 hover:text-blue-400 hover:border-blue-500 transition duration-300 rounded-md"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to={`/user/${userId}/dashboard`}
            className="px-4 py-2 border border-white text-gray-200 hover:text-blue-400 hover:border-blue-500 transition duration-300 rounded-md"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to={`/user/${userId}/course/${defaultCourse}/results`}
            className="px-4 py-2 border border-white text-gray-200 hover:text-blue-400 hover:border-blue-500 transition duration-300 rounded-md"
          >
            Results
          </Link>
        </li>
        <li>
          <Link
            to="/leaderboard"
            className="px-4 py-2 border border-white text-gray-200 hover:text-blue-400 hover:border-blue-500 transition duration-300 rounded-md"
          >
            Leaderboard
          </Link>
        </li>
      </ul>

      {/* Conditional rendering for Login/Signup or User Icon */}
      <div className="flex items-center">
        {isLoggedIn ? (
          <Link to="/profile" className="text-gray-200 hover:text-blue-400 transition duration-300">
            <User size={24} />
          </Link>
        ) : (
          <div className="flex rounded-md overflow-hidden">
            <Link to="/login">
              <button className="px-4 py-2 border-white rounded-tl-md rounded-bl-md border text-gray-200 bg-black hover:text-blue-400 hover:border-blue-500 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 border-white rounded-tr-md rounded-br-md border text-gray-200 bg-black hover:text-blue-400 hover:border-blue-500 transition duration-300">
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
