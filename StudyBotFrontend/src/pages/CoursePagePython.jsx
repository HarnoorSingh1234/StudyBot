import { Link } from 'react-router-dom';

function CoursePagePython() {
  // Mock data to represent progress and task completion status
  const courseProgress = 40; // Example progress value (e.g., 40% completed)
  const tasks = [
    {
      id: 1,
      title: 'Introduction to Python',
      videoLink: '#', // Link to the video (e.g., a video player link)
      taskLink: 'https://drive.google.com/example-python-task-pdf', // Link to the task PDF
      completed: false, // Example completion status
    },
    // Add more tasks here if needed
  ];

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-semibold text-yellow-400">Python Course</h2>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 bg-gray-900 p-4 rounded-md shadow-md border border-gray-700">
          <h3 className="text-lg font-medium text-gray-300">Progress</h3>
          <div className="w-40 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${courseProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">{courseProgress}%</p>
        </div>
      </div>

      {/* Task Sections */}
      {tasks.map((task) => (
        <div key={task.id} className="bg-black p-6 rounded-md shadow-md border border-white space-y-4">
          <div className="flex justify-between items-center">
            {/* Task Title and Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-300">Video {task.id}: {task.title}</h3>
              <p className="text-gray-400 text-sm">Watch the video to understand the basics of Python programming.</p>
            </div>

            {/* Status Badge */}
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
              className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-yellow-500 transition duration-300 text-sm"
              onClick={() => window.open(task.videoLink, '_blank')}
            >
              Watch Video
            </button>

            <div className="flex space-x-3">
              {/* Start Coding Button */}
              <Link to={`/user/:userId/course/python/task/${task.id}`}>
                <button className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-yellow-500 transition duration-300 text-sm">
                  Start Coding
                </button>
              </Link>

              {/* View Task Button */}
              <button
                className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-yellow-500 transition duration-300 text-sm"
                onClick={() => window.open(task.taskLink, '_blank')}
              >
                View Task
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoursePagePython;
