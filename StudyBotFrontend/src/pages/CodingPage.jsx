/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { supabase } from '../contexts/supabaseClient';

function CodingPage() {
  const { taskId, userId } = useParams();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const course = location.pathname.includes('/cpp') ? 'Cpp' : 'Python';

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user data:", userError);
      } else {
        setUser(userData.user);
      }
    };
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

  const handleRunCode = async () => {
    try {
      const response = await axios.post('/api/run-code', { code });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error running code. Please try again.');
      console.error('Run Code Error:', error);
    }
  };

  const saveSubmission = async (outputText) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          user_id: userId,
          task_id: taskId,
          code,
          output: outputText,
          is_correct: outputText === task.expected_output // Compare with expected output
        });
      
      if (error) {
        console.error('Error saving submission:', error);
      }
    } catch (error) {
      console.error('Submission Save Error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/submit-code', { code, taskId, course });
      const response = await axios.post('/api/analyze-code', { code });
      const { score, suggestions, optimalSolution } = response.data;

      // Save submission data to the database
      await saveSubmission(output);

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
      <h2 className={`text-4xl font-bold ${primaryColor} mb-4`}>
        {course} Coding Task {taskId > 15 ? taskId - 20 : taskId}
      </h2>

      {task ? (
        <>
          {/* Task Details Section */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h3 className="text-3xl font-semibold text-gray-200">{task.title}</h3>
            <p className="text-md text-gray-400 leading-relaxed">{task.question}</p>
          </div>

          {/* Code Editor Section */}
          <div className="bg-black p-6 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <Editor
              height="400px"
              defaultLanguage={course === 'Cpp' ? 'cpp' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                lineHeight: 1.5,
                scrollbar: { vertical: 'hidden' },
              }}
              wrapperClassName="bg-black"
            />

            {/* Run Code and Submit Code Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                className={`px-6 py-2 bg-black text-gray-200 border border-white rounded-lg ${borderColor} transition duration-300 hover:shadow-lg text-md`}
                onClick={handleRunCode}
              >
                Run Code
              </button>
              <button
                className={`px-6 py-2 bg-black text-gray-200 border border-white rounded-lg ${borderColor} transition duration-300 hover:shadow-lg text-md`}
                onClick={handleSubmit}
              >
                Submit Code
              </button>
            </div>

            {/* Output Section */}
            {output && (
              <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
                <h3 className="font-semibold text-gray-200 mb-2">Output</h3>
                <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
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
