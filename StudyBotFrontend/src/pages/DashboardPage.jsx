// src/pages/DashboardPage.js
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DashboardPage = () => {
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user data:", userError);
      } else {
        setUser(userData.user);
      }
    };

    const fetchUserProgress = async () => {
      setLoading(true);
      try {
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progressError) throw progressError;
          setUserProgress(progressData);
        }
      } catch (error) {
        console.error('Error fetching user progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData().then(fetchUserProgress);
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent tracking-wide text-center mb-12">
        My Dashboard
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className="text-center text-2xl text-gray-200 mb-6">
            Welcome, {user?.user_metadata?.username || 'User'}
          </h1>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Course Navigation Sections */}
            <div className="space-y-8">
              {/* C++ Course Section */}
              <div className="group bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-blue-500/50 transform hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-2xl font-semibold text-blue-400 mb-4">C++ Course</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Dive into C++ data structures and algorithms, starting from basics to advanced concepts.
                </p>
                <Link to={`/user/${user?.id}/course/cpp`}>
                  <button className="w-full px-4 py-2 text-gray-200 bg-black border border-blue-500 hover:text-blue-400 rounded-md transition duration-300">
                    Go to C++ Course
                  </button>
                </Link>
              </div>

              {/* Python Course Section */}
              <div className="group bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-yellow-500/50 transform hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Python Course</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Learn Python data structures and algorithms, with practical tasks and code examples.
                </p>
                <Link to={`/user/${user?.id}/course/python`}>
                  <button className="w-full px-4 py-2 text-gray-200 bg-black border border-yellow-500 hover:text-yellow-400 rounded-md transition duration-300">
                    Go to Python Course
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Progress Chart */}
            <div className="bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-white/50 transform hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-blue-400 mb-4">Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userProgress} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="gray" />
                  <XAxis dataKey="date" stroke="gray" />
                  <YAxis stroke="gray" />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress_percentage" stroke="#3b82f6" strokeWidth={2} name="Progress" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;