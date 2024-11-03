import { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

function ResultsPage() {
  const { course, taskId, userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackData = {
    completionStatus: true,
    score: 85,
    suggestions: [
      "Use more descriptive variable names.",
      "Consider refactoring this function for readability.",
      "Optimize your loop to reduce time complexity."
    ],
    optimalSolution: `int main() {\n  // Optimal solution code\n  return 0;\n}`
  };

  const {
    completionStatus = fallbackData.completionStatus,
    score = fallbackData.score,
    suggestions = fallbackData.suggestions,
    optimalSolution = fallbackData.optimalSolution
  } = location.state || fallbackData;

  const [message, setMessage] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  const explanation = [
    "int main() { - Start of the main function.",
    "// Optimal solution code - Placeholder for actual code implementation.",
    "return 0; - End of the main function, returns 0 indicating successful execution."
  ];

  const themeColor = course === 'python' ? 'text-yellow-400' : 'text-blue-400';
  const borderColor = course === 'python' ? 'border-yellow-500' : 'border-blue-500';
  const hoverColor = course === 'python' ? 'hover:text-yellow-400' : 'hover:text-blue-400';
  const gaugeColor = course === 'python' ? '#fcd34d' : '#3B82F6';

  useEffect(() => {
    if (score >= 90) setMessage("Excellent work!");
    else if (score >= 80) setMessage("Great job!");
    else if (score >= 70) setMessage("Well done!");
    else if (score >= 50) setMessage("Good effort!");
    else setMessage("Keep practicing!");
  }, [score]);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-6">
      {/* Title */}
      <h2 className={`text-4xl font-semibold ${themeColor} mb-4`}>
        Task Results - {course.charAt(0).toUpperCase() + course.slice(1).toLowerCase()} - Task {taskId}
      </h2>

      {/* Task Completion Status */}
      {completionStatus ? (
        <p className="text-lg font-medium text-green-400 mb-8">Task completed successfully!</p>
      ) : (
        <p className="text-lg font-medium text-yellow-400 mb-8">This is a dummy test result.</p>
      )}

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Left Section: Suggestions and Optimal Solution */}
        <div className="flex-1 space-y-6">
          {/* Optimal Solution with Dropdown Explanation */}
          <div className={`bg-black p-6 rounded-lg shadow-lg border ${borderColor} space-y-4 hover:shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${themeColor} mb-2`}>Optimal Solution</h3>
            <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded-md">{optimalSolution}</pre>
            
            {/* Toggle Explanation */}
            <div
              onClick={() => setShowExplanation(!showExplanation)}
              className={`cursor-pointer flex items-center mt-4 text-white ${hoverColor} transition-colors`}
            >
              <span className="mr-2">Explanation</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${showExplanation ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            {/* Explanation Section */}
            {showExplanation && (
              <div className="bg-gray-900 p-4 text-sm rounded-lg border border-gray-700 mt-4">
                <ul className="text-white text-sm space-y-2">
                  {explanation.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggestions for Improvement */}
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

        {/* Right Section: Speedometer Score in Bordered Box */}
        <div className="flex flex-col items-center md:w-1/4 mt-8 md:mt-0">
          <div className={`bg-black p-6 rounded-lg shadow-lg border ${borderColor} space-y-4 w-full flex flex-col items-center`}>
            <h3 className={`text-2xl font-semibold ${themeColor} mb-2`}>Your Score</h3>
            <GaugeChart
              id="score-gauge"
              nrOfLevels={5}
              colors={["#E5E5E5", gaugeColor]}
              arcWidth={0.2}
              percent={score / 100}
              textColor="#ffffff"
              style={{ width: '180px' }}
              hideText
            />
            <p className={`mt-4 text-lg font-semibold ${themeColor}`}>{message}</p>
            <p className="mt-2 text-lg font-semibold text-white">Score: {score}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          className="px-4 py-2 bg-black text-gray-200 border border-white rounded-md hover:border-blue-500 transition duration-300 text-sm"
          onClick={() => navigate(`/user/${userId}/dashboard`)}
        >
          Back to Dashboard
        </button>

        <Link
          to={`/user/${userId}/course/${course}/results`}
          className={`px-4 py-2 bg-black text-gray-200 border ${borderColor} rounded-md transition duration-300 text-sm ${hoverColor}`}
        >
          Go to Overall Results
        </Link>
      </div>
    </div>
  );
}

export default ResultsPage;
