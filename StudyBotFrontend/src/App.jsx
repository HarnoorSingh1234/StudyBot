import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursePageCpp from './pages/CoursePageCpp';
import CoursePagePython from './pages/CoursePagePython';
import CodingPage from './pages/CodingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResultsPage from './pages/ResultsPage';
import Navbar from './components/Navbar';
import OverallResultPage from './pages/OverallResultPage';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Dashboard, Login, and Signup Pages */}
          <Route path="/user/:userid/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Courses Section */}
          <Route path="/user/:userId/courses" element={<DashboardPage />} />
     

          {/* Specific Course Pages (C++ and Python) */}
          <Route path="/user/:userId/course/cpp" element={<CoursePageCpp />} />
          <Route path="/user/:userId/course/python" element={<CoursePagePython />} />

          {/* Coding Task Pages for each Course with dynamic task IDs */}
          <Route path="/user/:userId/course/cpp/task/:taskId" element={<CodingPage />} />
          <Route path="/user/:userId/course/python/task/:taskId" element={<CodingPage />} />

          {/* Overall Results for a Course */}
          <Route path="/user/:userId/course/:course/results" element={<OverallResultPage />} />

          {/* Individual Task Results */}
          <Route path="/user/:userId/course/:course/result/task/:taskId" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
