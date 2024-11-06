/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../contexts/supabaseClient';
import { analyzeCode } from '../utils/gemini';

function ResultsPage() {
  const { taskId, userId, course } = useParams(); // Include `course` in the params
  const navigate = useNavigate();
  const [completionStatus, setCompletionStatus] = useState(false);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [optimalSolution, setOptimalSolution] = useState('');
  const [explanation, setExplanation] = useState('');
  const [message, setMessage] = useState('Please try again.');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch task details (optimal solution and explanation) from the database
  const fetchTaskDetails = async () => {
    try {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('optimal_solution, explanation')
        .eq('task_id', taskId)
        .single();

      if (taskError) throw taskError;

      setOptimalSolution(taskData.optimal_solution);
      setExplanation(taskData.explanation);

      console.log("Fetched task details:", taskData);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // Function to fetch results (submission data) and calculate completion status and score
  const fetchResults = async () => {
    try {
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .select('output, is_correct, gemini_suggestions, task_score')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .single();

      if (submissionError) throw submissionError;

      setCompletionStatus(submissionData.is_correct);
      setSuggestions(
        submissionData.gemini_suggestions 
          ? JSON.parse(submissionData.gemini_suggestions) 
          : []
      );
      setScore(submissionData.task_score || 0);

      setMessage(submissionData.is_correct ? "Task completed successfully!" : "Please try again.");
      console.log("Fetched submission data:", submissionData);
    } catch (error) {
      console.error("Error fetching results:", error);
      setMessage("Error loading results. Please try again.");
    }
  };

  // Function to fetch suggestions from the Gemini AI API
  const fetchSuggestionsFromAI = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching suggestions from AI...");

      const analysis = await analyzeCode(optimalSolution, explanation, 'cpp'); // Adjust 'cpp' as necessary for language
      console.log("Analysis from Gemini:", analysis);

      const updatedSuggestions = {
        gemini_suggestions: JSON.stringify(analysis.suggestions || []),
        task_score: analysis.score || 0,
      };

      const { error: updateError } = await supabase
        .from('submissions')
        .update(updatedSuggestions)
        .eq('user_id', userId)
        .eq('task_id', taskId);

      if (updateError) throw updateError;

      setSuggestions(analysis.suggestions || []);
      setScore(analysis.score || 0);
      setMessage(analysis.isCorrect ? "Task completed successfully!" : "Please try again.");

      console.log("Updated submission data with Gemini suggestions:", updatedSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions from AI:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails(); // Fetch optimal solution and explanation when the component mounts
    fetchResults(); // Fetch submission data when the component mounts
  }, [userId, taskId]);

  useEffect(() => {
    if (score >= 90) setMessage("Excellent work!");
    else if (score >= 80) setMessage("Great job!");
    else if (score >= 70) setMessage("Well done!");
    else if (score >= 50) setMessage("Good effort!");
    else setMessage("Keep practicing!");
  }, [score]);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-6">
      <h2 className="text-4xl font-semibold text-blue-400 mb-4">
        Task Results - Task {taskId}
      </h2>

      <p className="text-lg font-medium text-green-400 mb-8">{message}</p>

      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="flex-1 space-y-6">
          <div className="bg-black p-6 rounded-lg shadow-lg border border-blue-500 space-y-4 hover:shadow-xl">
            <h3 className="text-2xl font-semibold text-blue-400 mb-2">Optimal Solution</h3>
            <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded-md">{optimalSolution}</pre>

            <div
              onClick={() => setShowExplanation(!showExplanation)}
              className="cursor-pointer flex items-center mt-4 text-white hover:text-blue-400 transition-colors"
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

          <div className="bg-black p-6 rounded-lg shadow-lg border border-blue-500 space-y-4 hover:shadow-xl">
            <h3 className="text-2xl font-semibold text-blue-400 mb-2">Suggestions for Improvement</h3>
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
          <div className="bg-black p-6 rounded-lg shadow-lg border border-blue-500 space-y-4 w-full flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-blue-400 mb-2">Your Score</h3>
            <GaugeChart id="score-gauge" nrOfLevels={5} colors={["#E5E5E5"]} arcWidth={0.2} percent={score / 100} textColor="#ffffff" style={{ width: '180px' }} hideText />
            <p className="mt-4 text-lg font-semibold text-blue-400">{message}</p>
            <p className="mt-2 text-lg font-semibold text-white">Score: {score}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button onClick={fetchSuggestionsFromAI} disabled={isLoading} className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-blue-500 transition duration-300 text-sm">
          {isLoading ? "Fetching..." : "Fetch Suggestions from AI"}
        </button>
        <button onClick={() => navigate(`/user/${userId}/dashboard`)} className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-blue-500 transition duration-300 text-sm">
          Back to Dashboard
        </button>
        <Link to={`/user/${userId}/course/${course}/results`} className="px-4 py-2 bg-black text-gray-200 border border-blue-500 rounded-md transition duration-300 text-sm hover:text-blue-400">
          Go to Overall Results
        </Link>
      </div>
    </div>
  );
}

export default ResultsPage;
