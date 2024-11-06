/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { supabase } from '../contexts/supabaseClient';
import Loader from '../components/Loader';

function CodingPage() {
  const { taskId, userId } = useParams();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(location.pathname.includes('/cpp') ? 'cpp' : 'python');
  const [isLoading, setIsLoading] = useState(false);
  const [runStatus, setRunStatus] = useState('loading');

  const languageConfigs = {
    cpp: {
      id: 54,
      name: 'C++',
      monacoId: 'cpp',
      color: 'text-blue-400',
      borderColor: 'hover:border-blue-500'
    },
    python: {
      id: 71,
      name: 'Python',
      monacoId: 'python',
      color: 'text-yellow-400',
      borderColor: 'hover:border-yellow-500'
    }
  };

  // Determine the course (C++ or Python) based on the URL path
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
    const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
    const JUDGE0_API_KEY = 'c24a75644fmsh92973e4f8e44ddfp1c4484jsne2a394d81634';

    try {
      // Convert source code to Base64
      const encodedCode = btoa(code);
      
      // Step 1: Create a submission
      const createSubmissionResponse = await axios({
        method: 'post',
        url: `${JUDGE0_API_URL}?base64_encoded=true&fields=*`,
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
          language_id: languageConfigs[selectedLanguage].id,
          source_code: encodedCode,
          stdin: btoa('') // Add base64 encoded input if needed
        }
      });

      const { token } = createSubmissionResponse.data;

      // Step 2: Poll for results
      const getResult = async () => {
        const resultResponse = await axios({
          method: 'get',
          url: `${JUDGE0_API_URL}/${token}?base64_encoded=true&fields=*`,
          headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });

        const { status, stdout, stderr } = resultResponse.data;

        if (status.id <= 2) {
          // Status 1: In Queue, Status 2: Processing
          setTimeout(getResult, 1000); // Poll every second
        } else if (status.id === 3) {
          // Status 3: Accepted - decode the base64 output
          setOutput(atob(stdout || '')); // Decode base64 output
        } else {
          // Any other status indicates an error
          setOutput(atob(stderr || '') || 'Error running code. Please try again.');
        }
      };

      getResult();
    } catch (error) {
      console.error('Run Code Error:', error.response?.data || error);
      setOutput('Error running code. Please try again.');
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

// new code which sends data 
  const handleSubmit = async () => {
    try {
      // Insert code submission data to Supabase
      const { error } = await supabase
        .from('submissions')
        .insert({
          user_id: userId,        // The user's ID from params
          task_id: taskId,        // The task ID from params
          code: code              // The code written by the user in the editor
        });
  
      if (error) {
        console.error('Error saving submission to Supabase:', error);
        setOutput('Error saving your submission. Please try again.');
        return;
      }
  
      // For example, redirect to results page after saving the submission
      navigate(`/user/${userId}/course/${course.toLowerCase()}/result/task/${taskId}`, {
        state: { completionStatus: true, taskId, course },
      });
    } catch (error) {
      console.error('Error submitting code:', error);
      setOutput('Error submitting code. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-6">

      <h2 className={`text-4xl font-semibold ${languageConfigs[selectedLanguage].color} mb-4`}>
        {course} Coding Task {taskId}
      </h2>

      {task ? (
        <>
          {/* Task Details Section */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 space-y-4">
            <h3 className="text-3xl font-semibold text-gray-200">{task.title}</h3>
            <p className="text-md text-gray-400 leading-relaxed">{task.question}</p>
          </div>

          {/* Code Editor Section */}


          <div className="bg-gray-900 p-4 rounded-md shadow-lg border border-gray-700 space-y-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-gray-300">Select Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800 text-gray-200 px-3 py-1 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                {Object.entries(languageConfigs).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>

            <Editor
              height="400px"
              defaultLanguage={languageConfigs[selectedLanguage].monacoId}

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

                className={`px-4 py-2 bg-black text-gray-200 border border-white rounded-md ${languageConfigs[selectedLanguage].borderColor} transition duration-300 text-sm`}
                onClick={handleRunCode}
              >
                Run Code
              </button>
              <button

                className={`px-4 py-2 bg-black text-gray-200 border border-white rounded-md ${languageConfigs[selectedLanguage].borderColor} transition duration-300 text-sm`}

                onClick={handleSubmit}
              >
                Submit Code
              </button>
            </div>

            {/* Output Section */}
            {output && (

              <div className="mt-4 bg-gray-800 p-4 rounded-md border border-gray-700 text-sm text-gray-300">
                <h3 className="font-semibold text-gray-300 mb-2">Output</h3>
                
                {isLoading ? (
                  <Loader 
                    status={runStatus} 
                    size="medium"
                  />
                ) : (
                  <pre>{output}</pre>
                )}

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
