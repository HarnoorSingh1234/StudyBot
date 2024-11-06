import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';
import { supabase } from '../contexts/supabaseClient';

function OverallResultPage() {
  const { course, userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [overallSuggestions, setOverallSuggestions] = useState([]);
  const [averageScore, setAverageScore] = useState(0);

  const themeColor = course === 'python' ? 'text-yellow-400' : 'text-blue-400';
  const borderColor = course === 'python' ? 'border-yellow-500' : 'border-blue-500';
  const gaugeColor = course === 'python' ? '#fcd34d' : '#3B82F6';

  useEffect(() => {
    const fetchSubmittedTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('task_id, code, task_score, is_correct, gemini_suggestions')
          .eq('user_id', userId);

        if (error) throw error;

        // Parse and format the tasks
        const formattedTasks = data.map((submission) => ({
          id: submission.task_id,
          title: `Task ${submission.task_id}`, // You may want to fetch actual titles from a 'tasks' table if available
          score: submission.task_score || 0,
          completionStatus: submission.is_correct,
          suggestions: submission.gemini_suggestions ? JSON.parse(submission.gemini_suggestions) : [],
        }));

        setTasks(formattedTasks);

        // Calculate average score
        const completedTasks = formattedTasks.filter((task) => task.completionStatus);
        const avgScore = completedTasks.length
          ? completedTasks.reduce((sum, task) => sum + task.score, 0) / completedTasks.length
          : 0;
        setAverageScore(avgScore);

        // Get suggestions from completed tasks
        const allSuggestions = completedTasks.flatMap((task) => task.suggestions);
        setOverallSuggestions(allSuggestions);

      } catch (error) {
        console.error("Error fetching submitted tasks:", error);
      }
    };

    fetchSubmittedTasks();
  }, [userId]);

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
          {overallSuggestions.length > 0 ? (
            overallSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))
          ) : (
            <li>No suggestions available.</li>
          )}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className={`text-2xl font-semibold ${themeColor} mb-4`}>Submitted Tasks</h3>
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
