/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-gray-200 p-8 flex flex-col items-center space-y-16">
      {/* Background Accent Elements */}

      {/* Introduction Section */}
      <section className="text-center max-w-3xl z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-6">
          Welcome to StudyBot
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 tracking-wide leading-relaxed">
          Boost your programming skills with StudyBot's interactive learning platform. Get hands-on experience with C++ and Python, and join a community of learners.
        </p>
        <Link to="/login">
          <button className="px-8 py-3 border border-white text-gray-200 bg-black rounded-md hover:text-blue-400 hover:border-blue-500 transition duration-300">
            Start Learning
          </button>
        </Link>
      </section>

      {/* Courses Section */}
      <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        {/* C++ Course Card */}
        <div className="bg-black p-8 rounded-lg shadow-lg border border-white">
          <h3 className="text-3xl font-semibold text-blue-400 mb-4">C++ Programming</h3>
          <p className="text-gray-400 mb-6">
            Learn C++ from the ground up. This course covers fundamental concepts, data structures, algorithms, and more with hands-on exercises and challenges.
          </p>
          <Link to="/login">
            <button className="w-full px-4 py-2 border border-white text-gray-200 bg-black rounded-md hover:text-blue-400 hover:border-blue-500 transition duration-300">
              Start C++ Course
            </button>
          </Link>
        </div>

        {/* Python Course Card */}
        <div className="bg-black p-8 rounded-lg shadow-lg border border-white">
          <h3 className="text-3xl font-semibold text-blue-400 mb-4">Python Programming</h3>
          <p className="text-gray-400 mb-6">
            Get started with Python, one of the most popular programming languages. This course includes topics from basics to advanced programming techniques.
          </p>
          <Link to="/login">
            <button className="w-full px-4 py-2 border border-white text-gray-200 bg-black rounded-md hover:text-blue-400 hover:border-blue-500 transition duration-300">
              Start Python Course
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
