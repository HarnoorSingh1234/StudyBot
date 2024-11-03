import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';

const courseResultsData = {
  cpp: {
    tasks: [
      { id: 1, title: "Task 1: Basics of C++", score: 85, completionStatus: true },
      { id: 2, title: "Task 2: OOP in C++", score: 92, completionStatus: true },
      { id: 3, title: "Task 3: Advanced C++", score: 78, completionStatus: false }
    ],
    overallSuggestions: [
      "Focus on optimizing algorithms in loops.",
      "Use meaningful variable names across tasks.",
      "Try using modern C++ practices."
    ]
  },
  python: {
    tasks: [
      { id: 1, title: "Task 1: Python Basics", score: 88, completionStatus: true },
      { id: 2, title: "Task 2: Data Structures", score: 80, completionStatus: true },
      { id: 3, title: "Task 3: Advanced Python", score: 90, completionStatus: true }
    ],
    overallSuggestions: [
      "Focus on using built-in functions where applicable.",
      "Optimize the readability of the code.",
      "Experiment with advanced libraries for efficient solutions."
    ]
  }
};

function OverallResultPage() {
  const { course, userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [overallSuggestions, setOverallSuggestions] = useState([]);
  const [averageScore, setAverageScore] = useState(0);

  const themeColor = course === 'python' ? 'text-yellow-400' : 'text-blue-400';
  const borderColor = course === 'python' ? 'border-yellow-500' : 'border-blue-500';
  const gaugeColor = course === 'python' ? '#fcd34d' : '#3B82F6';

  useEffect(() => {
    const courseData = courseResultsData[course] || { tasks: [], overallSuggestions: [] };
    setTasks(courseData.tasks);
    setOverallSuggestions(courseData.overallSuggestions);

    const completedTasks = courseData.tasks.filter(task => task.completionStatus);
    const avgScore = completedTasks.length
      ? completedTasks.reduce((sum, task) => sum + task.score, 0) / completedTasks.length
      : 0;
    setAverageScore(avgScore);
  }, [course]);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-8">
      <h2 className={`text-4xl font-semibold ${themeColor} mb-8`}>
        {course.charAt(0).toUpperCase() + course.slice(1).toLowerCase()} Course - Overall Results
      </h2>

      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">Average Score</h3>
        <GaugeChart
          id="average-score-gauge"
          nrOfLevels={5}
          colors={["#E5E5E5", gaugeColor]}
          arcWidth={0.2}
          percent={averageScore / 100}
          textColor="#ffffff"
          style={{ width: '180px' }}
          hideText
        />
        <p className={`mt-4 text-lg font-semibold ${themeColor}`}>Average Score: {averageScore.toFixed(1)}</p>
      </div>

      <div className={`bg-gray-800 p-6 rounded-lg shadow-lg border ${borderColor} space-y-4`}>
        <h3 className={`text-2xl font-semibold ${themeColor} mb-2`}>Overall Suggestions</h3>
        <ul className="list-disc list-inside text-gray-300 text-sm">
          {overallSuggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className={`text-2xl font-semibold ${themeColor} mb-4`}>Completed Tasks</h3>
        {tasks.map((task) => (
          <div key={task.id} className={`bg-gray-900 p-4 rounded-md shadow-md border ${borderColor} flex justify-between items-center`}>
            <div>
              <h4 className="text-xl font-semibold text-gray-300">{task.title}</h4>
              <p className="text-sm text-gray-400">Score: {task.score}</p>
              <p className={`text-sm font-medium ${task.completionStatus ? 'text-green-400' : 'text-red-400'}`}>
                Status: {task.completionStatus ? 'Completed' : 'Incomplete'}
              </p>
            </div>
            <Link to={`/user/${userId}/course/${course}/result/task/${task.id}`}>
              <button className={`px-4 py-2 text-gray-200 bg-black border ${borderColor} rounded-md hover:${themeColor} transition duration-300 text-sm`}>
                View Task Result
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OverallResultPage;
