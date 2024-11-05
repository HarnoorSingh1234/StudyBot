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
  const [tasks, setTasks] = useState([]);
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

    const fetchTasksAndProgress = async () => {
      setLoading(true);
      try {
        // Fetch tasks from the tasks table in Supabase
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*');

        if (tasksError) throw tasksError;
        setTasks(tasksData);

        // Fetch user progress for each task from the user_progress table
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progressError) throw progressError;
          setUserProgress(progressData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData().then(fetchTasksAndProgress);
  }, [user]);

  // Function to update the progress of a task
  const updateProgress = async (taskId, newProgress) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          task_id: taskId,
          progress_percentage: newProgress,
          completion_status: newProgress === 100
        }, { onConflict: ['user_id', 'task_id'] });

      if (error) throw error;
      console.log('Progress updated successfully:', data);
      setUserProgress((prevProgress) =>
        prevProgress.map((progress) =>
          progress.task_id === taskId ? { ...progress, progress_percentage: newProgress } : progress
        )
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-12">
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

          {/* Display tasks with user-specific progress */}
          <div className="space-y-8">
            {tasks.map((task) => {
              const progress = userProgress.find((p) => p.task_id === task.task_id);
              const progressPercentage = progress ? progress.progress_percentage : 0;

              return (
                <div key={task.task_id} className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800 space-y-4">
                  <h3 className="text-2xl font-semibold text-blue-400">{task.title}</h3>
                  <p className="text-gray-400 mb-2">{task.question}</p>
                  <div className="progress-bar-container bg-gray-700 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-width duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400">{progressPercentage}% completed</p>
                  <button
                    className="w-full px-4 py-2 mt-4 text-gray-200 bg-blue-500 rounded-md transition duration-300"
                    onClick={() => updateProgress(task.task_id, Math.min(progressPercentage + 10, 100))}
                  >
                    Increase Progress
                  </button>
                  <Link to={`/user/${user.id}/course/${task.course}/task/${task.task_id}`}>
                    <button className="w-full px-4 py-2 mt-4 text-gray-200 bg-black border border-blue-500 hover:text-blue-400 rounded-md transition duration-300">
                      View Task
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Progress Over Time Chart (Sample Data) */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-white">
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
        </>
      )}
    </div>
  );
};

export default DashboardPage;
