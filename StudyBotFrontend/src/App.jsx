import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePageCpp from './pages/CoursePageCpp';
import CoursePagePython from './pages/CoursePagePython';
import CodingPage from './pages/CodingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResultsPage from './pages/ResultsPage'; // Import the ResultsPage
import Navbar from './components/Navbar';
import OverallResultPage from './pages/OverallResultPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> 
      <div className="container">
        <Routes>
          {/* Home and Course Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/course/cpp" element={<CoursePageCpp />} />
          <Route path="/course/python" element={<CoursePagePython />} />

          {/* Coding Task Pages with dynamic task IDs for C++ and Python */}
          <Route path="/cpp/coding/task/:taskId" element={<CodingPage />} />
          <Route path="/python/coding/task/:taskId" element={<CodingPage />} />

          {/* Dashboard, Login, and Signup Pages */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/:course/results" element={<OverallResultPage />} />
  

          {/* Results Page with dynamic course and task IDs */}
          <Route path="/course/:course/task/:taskId" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
