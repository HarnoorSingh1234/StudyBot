import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data for courses and progress graph
const courses = [
  { id: 'cpp', name: "C++ Basics", progress: 70 },
  { id: 'python', name: "Python for Beginners", progress: 40 },
];

const progressData = [
  { date: '2023-10-01', cppProgress: 20, pythonProgress: 10 },
  { date: '2023-10-05', cppProgress: 40, pythonProgress: 30 },
  { date: '2023-10-10', cppProgress: 60, pythonProgress: 50 },
  { date: '2023-10-15', cppProgress: 70, pythonProgress: 60 },
];

const studySessions = {
  '2023-08-10': 1,
  '2023-08-15': 2,
  '2023-09-05': 3,
  '2023-09-10': 4,
  '2023-09-15': 2,
  '2023-10-05': 3,
  '2023-10-10': 4,
};

function DashboardPage() {
  const [userCourses, setUserCourses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedYear, setSelectedYear] = useState('2023');

  useEffect(() => {
    setUserCourses(courses);
  }, []);

  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ date, studyLevel: studySessions[date] || 0 });
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8 space-y-12">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent tracking-wide text-center mb-12">My Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* Course Progress Section */}
        <div className="space-y-8">
          {userCourses.map((course) => (
            <div key={course.id} className={`bg-gray-900 p-6 rounded-lg shadow-lg border ${course.id === 'python' ? 'border-yellow-500' : 'border-blue-500'} space-y-4`}>
              <h3 className={`text-2xl font-semibold ${course.id === 'python' ? 'text-yellow-400' : 'text-blue-400'}`}>{course.name}</h3>
              <div className="progress-bar-container bg-gray-700 h-4 rounded-full overflow-hidden">
                <div
                  className={`${course.id === 'python' ? 'bg-yellow-500' : 'bg-blue-500'} h-full transition-width duration-300`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="text-gray-400">{course.progress}% completed</p>
              <div className="flex space-x-4">
                <Link to={`/course/${course.id}`}>
                  <button className={`w-full px-4 py-2 mt-4 text-gray-200 bg-black border ${course.id === 'python' ? 'border-yellow-500 hover:text-yellow-400' : 'border-blue-500 hover:text-blue-400'} rounded-md transition duration-300`}>
                    Continue Course
                  </button>
                </Link>
                <Link to={`/${course.id}/results`}>
                  <button className={`w-full px-4 py-2 mt-4 text-gray-200 bg-black border ${course.id === 'python' ? 'border-yellow-500 hover:text-yellow-400' : 'border-blue-500 hover:text-blue-400'} rounded-md transition duration-300`}>
                    View Overall Results
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Graph with Calendar */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-white">
          <h3 className="text-2xl font-semibold text-blue-400 mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="gray" />
              <XAxis dataKey="date" stroke="gray" />
              <YAxis stroke="gray" />
              <Tooltip />
              <Line type="monotone" dataKey="cppProgress" stroke="#3b82f6" strokeWidth={2} name="C++ Progress" />
              <Line type="monotone" dataKey="pythonProgress" stroke="#fcd34d" strokeWidth={2} name="Python Progress" />
            </LineChart>
          </ResponsiveContainer>

          {/* Month and Year Selection */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="month" className="text-blue-400">Month:</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-black border border-gray-600 text-gray-200 rounded p-1"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="year" className="text-blue-400">Year:</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-black border border-gray-600 text-gray-200 rounded p-1"
              >
                {[2021, 2022, 2023, 2024].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Study Calendar Section */}
          <div className="grid grid-cols-7 gap-0.5">
            {generateCalendarDays().map((day) => (
              <div
                key={day.date}
                className={`w-6 h-6 rounded-sm ${
                  day.studyLevel === 1 ? 'bg-green-600' :
                  day.studyLevel === 2 ? 'bg-green-500' :
                  day.studyLevel === 3 ? 'bg-green-400' :
                  day.studyLevel === 4 ? 'bg-green-300' : 'bg-gray-700'
                }`}
                title={`Date: ${day.date} | Study Level: ${day.studyLevel}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
