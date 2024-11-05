import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient';

function CoursePageCpp() {
  const [tasks, setTasks] = useState([]);
  const [courseProgress, setCourseProgress] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks for C++ course (task IDs 1 to 10)
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('course', 'cpp')
          .gte('task_id', 1)
          .lte('task_id', 10);

        if (error) throw error;
        
        setTasks(data);
        calculateProgress(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Calculate course progress based on the completion status of tasks
  const calculateProgress = (tasks) => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const progress = (completedTasks / tasks.length) * 100;
    setCourseProgress(Math.round(progress));
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-semibold text-blue-400">C++ Course</h2>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 bg-gray-900 p-4 rounded-md shadow-md border border-gray-700">
          <h3 className="text-lg font-medium text-gray-300">Progress</h3>
          <div className="w-40 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${courseProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">{courseProgress}%</p>
        </div>
      </div>

      {/* Task Sections */}
      {tasks.map((task) => (
        <div 
          key={task.task_id} 
          className="bg-black p-6 rounded-md shadow-md border border-white transition-all duration-300 hover:shadow-lg hover:border-blue-500 space-y-4"
        > 
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-300">
                Video {task.task_id}: {task.title}
              </h3>
              <p className="text-gray-400 text-sm">
                Watch the video to understand the basics of C++ programming.
              </p>
            </div>

            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              task.completed ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
            }`}>
              {task.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 space-y-3 md:space-y-0">
            {/* Watch Video Button */}
            <button
              className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-blue-500 transition-all duration-300 hover:shadow-lg text-sm"
              onClick={() => window.open(task.video_link, '_blank')}
            >
              Watch Video
            </button>

            <div className="flex space-x-3">
              {/* Start Coding Button */}
              <Link to={`/user/:userId/course/cpp/task/${task.task_id}`}>
                <button className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-blue-500 transition-all duration-300 hover:shadow-lg text-sm">
                  Start Coding
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoursePageCpp;