import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-black backdrop-blur-lg shadow-lg p-4 flex items-center justify-between border-b border-gray-700">
      {/* Logo */}
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent tracking-wide">StudyBot</h1>
      
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
            to="/dashboard"
            className="px-4 py-2 border border-white text-gray-200 hover:text-blue-400 hover:border-blue-500 transition duration-300 rounded-md"
          >
            Dashboard
          </Link>
        </li>
      </ul>
      
      {/* Login and Sign Up Buttons Grouped in a Div */}
      <div className="flex  rounded-md overflow-hidden">
        <Link to="/login">
          <button className="px-4 py-2 border-white rounded-tl-md rounded-bl-md border text-gray-200 bg-black hover:text-blue-400 hover:border-blue-500 transition duration-300 ">
            Login
          </button>
        </Link>
        <Link 
        className="px-4 py-2 text-gray-200 border-white rounded-tr-md rounded-br-md border bg-black hover:text-blue-400 hover:border-blue-500 transition duration-300"
        to="/signup">
          <button >
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
