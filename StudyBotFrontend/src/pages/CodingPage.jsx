import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { supabase } from '../contexts/supabaseClient';

function CodingPage() {
  const { taskId, userId } = useParams(); // Retrieve taskId and userId from the URL
  const location = useLocation(); // Retrieve location to determine the course
  const [task, setTask] = useState(null); // State to store task details
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  // Determine the course (C++ or Python) based on the URL path
  const course = location.pathname.includes('/cpp') ? 'Cpp' : 'Python';

  // Fetch task details from Supabase based on taskId
  useEffect(() => {
    const fetchTaskDetails = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (error) {
        console.error('Error fetching task details:', error);
      } else {
        setTask(data);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  // Function to handle code execution (Run Code)
  const handleRunCode = async () => {
    try {
      const response = await axios.post('/api/run-code', { code });
      setOutput(response.data.output); // Assumes the output is in response.data.output
    } catch (error) {
      setOutput('Error running code. Please try again.');
      console.error('Run Code Error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save code to the database
      await axios.post('/api/submit-code', { code, taskId, course });

      // Send code to Gemini API for suggestions and score
      const response = await axios.post('/api/analyze-code', { code });
      const { score, suggestions, optimalSolution } = response.data;

      // Navigate to ResultsPage with the user's code, suggestions, score, and optimal solution
      navigate(`/user/${userId}/course/${course.toLowerCase()}/result/task/${taskId}`, {
        state: { completionStatus: true, score, suggestions, optimalSolution, taskId, course },
      });
    } catch (error) {
      console.error('Submit Code Error:', error);
      navigate(`/user/${userId}/course/${course.toLowerCase()}/result/task/${taskId}`, {
        state: { completionStatus: false },
      });
    }
  };

  const primaryColor = course === 'Python' ? 'text-yellow-400' : 'text-blue-400';
  const borderColor = course === 'Python' ? 'hover:border-yellow-500' : 'hover:border-blue-500';

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-6">
      <h2 className={`text-4xl font-semibold ${primaryColor} mb-4`}>
        {course} Coding Task {taskId}
      </h2>

      {task ? (
        <>
          {/* Task Details Section */}
          <div className="bg-gray-900 p-4 rounded-md shadow-lg border border-gray-700 space-y-4">
            <h3 className="text-2xl text-gray-300">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.question}</p>
            
          </div>

          {/* Code Editor Section */}
          <div className="bg-gray-900 p-4 rounded-md shadow-lg border border-gray-700 space-y-4">
            <Editor
              height="400px"
              defaultLanguage={course === 'C++' ? 'cpp' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
              }}
            />

            {/* Run Code and Submit Code Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                className={`px-4 py-2 bg-black text-gray-200 border border-white rounded-md ${borderColor} transition duration-300 text-sm`}
                onClick={handleRunCode}
              >
                Run Code
              </button>
              <button
                className={`px-4 py-2 bg-black text-gray-200 border border-white rounded-md ${borderColor} transition duration-300 text-sm`}
                onClick={handleSubmit}
              >
                Submit Code
              </button>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mt-4 bg-gray-800 p-4 rounded-md border border-gray-700 text-sm text-gray-300">
                <h3 className="font-semibold text-gray-300 mb-2">Output</h3>
                <pre>{output}</pre>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
}

export default CodingPage;