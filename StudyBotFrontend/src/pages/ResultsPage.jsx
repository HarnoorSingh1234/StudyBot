/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient';

function ResultsPage() {
  const { course, taskId, userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  console.log("User ID:", userId);
  console.log("Course:", course);
  console.log("Task ID:", taskId);
  const [completionStatus, setCompletionStatus] = useState(false);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [optimalSolution, setOptimalSolution] = useState('');
  const [explanation, setExplanation] = useState('');
  const [message, setMessage] = useState('Please try again.');
  const [showExplanation, setShowExplanation] = useState(false);

  const themeColor = course === 'python' ? 'text-yellow-400' : 'text-blue-400';
  const borderColor = course === 'python' ? 'border-yellow-500' : 'border-blue-500';
  const hoverColor = course === 'python' ? 'hover:text-yellow-400' : 'hover:text-blue-400';
  const gaugeColor = course === 'python' ? '#fcd34d' : '#3B82F6';
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch the submission data
        
        const { data: submissionData, error: submissionError } = await supabase
          .from('submissions')
          .select('output, is_correct, gemini_suggestions, task_score')
          .eq('user_id', userId)
          .eq('task_id', taskId)
          .single();
  
        if (submissionError) throw submissionError;
  
        // Fetch the task details
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('optimal_solution, explanation')
          .eq('task_id', taskId)
          .single();
  
        if (taskError) throw taskError;
  
        // Set the fetched data
        setCompletionStatus(submissionData.is_correct);
        setSuggestions(submissionData.gemini_suggestions ? JSON.parse(submissionData.gemini_suggestions) : []);
        setOptimalSolution(taskData.optimal_solution);
        setExplanation(taskData.explanation);
        setScore(submissionData.task_score || 0); // Set score from `task_score` field or default to 0
  
        if (submissionData.is_correct) {
          setMessage("Task completed successfully!");
        } else {
          setMessage("Please try again.");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setMessage("Error loading results. Please try again.");
      }
    };
  
    fetchResults();
  }, [userId, taskId]);
  
  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-6">
      <h2 className={`text-4xl font-semibold ${themeColor} mb-4`}>
        Task Results - {course.charAt(0).toUpperCase() + course.slice(1).toLowerCase()} - Task {taskId}
      </h2>

      <p className="text-lg font-medium text-green-400 mb-8">{message}</p>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-1 space-y-6">
          <div className={`bg-black p-6 rounded-lg shadow-lg border ${borderColor} space-y-4 hover:shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${themeColor} mb-2`}>Optimal Solution</h3>
            <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded-md">{optimalSolution}</pre>

            <div
              onClick={() => setShowExplanation(!showExplanation)}
              className={`cursor-pointer flex items-center mt-4 text-white ${hoverColor} transition-colors`}
            >
              <span className="mr-2">Explanation</span>
              <svg className={`w-5 h-5 transform transition-transform ${showExplanation ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            {showExplanation && (
              <div className="bg-gray-900 p-4 text-sm rounded-lg border border-gray-700 mt-4">
                <p className="text-white text-sm">{explanation}</p>
              </div>
            )}
          </div>

          <div className={`bg-black p-6 rounded-lg shadow-lg border ${borderColor} space-y-4 hover:shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${themeColor} mb-2`}>Suggestions for Improvement</h3>
            <ul className="list-disc list-inside pl-4 text-white text-sm space-y-1">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))
              ) : (
                <p>No suggestions available.</p>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center md:w-1/4 mt-8 md:mt-0">
          <div className={`bg-black p-6 rounded-lg shadow-lg border ${borderColor} space-y-4 w-full flex flex-col items-center`}>
            <h3 className={`text-2xl font-semibold ${themeColor} mb-2`}>Your Score</h3>
            <GaugeChart id="score-gauge" nrOfLevels={5} colors={["#E5E5E5", gaugeColor]} arcWidth={0.2} percent={score / 100} textColor="#ffffff" style={{ width: '180px' }} hideText />
            <p className={`mt-4 text-lg font-semibold ${themeColor}`}>{message}</p>
            <p className="mt-2 text-lg font-semibold text-white">Score: {score}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-blue-500 transition duration-300 text-sm" onClick={() => navigate(`/user/${userId}/dashboard`)}>
          Back to Dashboard
        </button>
        <Link to={`/user/${userId}/course/${course}/results`} className={`px-4 py-2 bg-black text-gray-200 border ${borderColor} rounded-md transition duration-300 text-sm ${hoverColor}`}>
          Go to Overall Results
        </Link>
      </div>
    </div>
  );
}

export default ResultsPage;
