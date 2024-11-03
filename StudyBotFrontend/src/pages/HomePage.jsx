/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Terminal, Code2, Trophy, ChevronDown } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { UserContext } from '../contexts';
import { TasksContext } from '../contexts';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useContext(UserContext);
  const { tasks } = useContext(TasksContext);
  const { userId } = useParams();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    setIsVisible(true);

    const smoothScroll = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach((link) => link.addEventListener('click', smoothScroll));

    return () => {
      scrollLinks.forEach((link) => link.removeEventListener('click', smoothScroll));
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-gray-200 pt-20 overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 z-10"
        data-aos="fade-up"
      >
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
            StudyBot
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Master Data Structures & Algorithms with our AI-powered learning platform. Get personalized solutions in
            <span className="text-cyan-500"> Python</span> and <span className="text-teal-500">C++</span>.
          </p>
          <Link to={user ? `/user/${userId}/dashboard` : '/login'}>
            <button className="px-8 py-4 bg-black border border-white rounded-lg text-white font-semibold hover:border-cyan-500 hover:text-cyan-500 transform hover:scale-105 transition-all duration-300">
              {user ? 'Go to Dashboard' : 'Start Learning Now'}
            </button>
          </Link>
        </div>
        <a href="#courses" className="absolute bottom-8 animate-bounce">
          <ChevronDown size={32} className="text-gray-500" />
        </a>
      </section>

      {/* Courses Section */}
      <section id="courses" className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="bg-black/80 backdrop-blur-sm p-8 rounded-lg border border-blue-500/50 hover:border-blue-500 transition-all duration-300"
            data-aos="fade-right"
          >
            <h3 className="text-3xl font-semibold text-blue-400 mb-4">C++ Programming</h3>
            <p className="text-gray-400 mb-6">Build a solid foundation in C++. From basic syntax to complex algorithms, dive deep with interactive tasks and gain hands-on experience.</p>
            <Link to={`/user/${userId}/course/cpp`}>
              <button className="w-full px-4 py-2 border border-blue-500 text-gray-200 bg-black rounded-md hover:text-blue-400 hover:border-blue-500 transition duration-300">
                Start C++ Course
              </button>
            </Link>
          </div>
          <div
            className="bg-black/80 backdrop-blur-sm p-8 rounded-lg border border-yellow-500/50 hover:border-yellow-500 transition-all duration-300"
            data-aos="fade-left"
          >
            <h3 className="text-3xl font-semibold text-yellow-400 mb-4">Python Programming</h3>
            <p className="text-gray-400 mb-6">Get started with Python, covering fundamentals to advanced topics. Perfect for data structures, algorithms, and problem-solving.</p>
            <Link to={`/user/${userId}/course/python`}>
              <button className="w-full px-4 py-2 border border-yellow-500 text-gray-200 bg-black rounded-md hover:text-yellow-400 hover:border-yellow-500 transition duration-300">
                Start Python Course
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="group bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-cyan-500/50 transform hover:-translate-y-2 transition-all duration-300"
            data-aos="zoom-in"
          >
            <div className="mb-6 text-cyan-500 relative"><Code2 size={40} /></div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-500">AI-Powered Solutions</h3>
            <p className="text-gray-400 leading-relaxed">Receive AI-generated code solutions and tips to improve your problem-solving skills.</p>
          </div>
          <div
            className="group bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-teal-500/50 transform hover:-translate-y-2 transition-all duration-300"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="mb-6 text-teal-500 relative"><Terminal size={40} /></div>
            <h3 className="text-2xl font-bold mb-4 text-teal-500">Built-in IDE</h3>
            <p className="text-gray-400 leading-relaxed">Write, run, and debug code directly within the platform using the built-in IDE.</p>
          </div>
          <div
            className="group bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-gray-800 hover:border-cyan-500/50 transform hover:-translate-y-2 transition-all duration-300"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <div className="mb-6 text-cyan-500 relative"><Trophy size={40} /></div>
            <h3 className="text-2xl font-bold mb-4 text-cyan-500">Global Leaderboard</h3>
            <p className="text-gray-400 leading-relaxed">Compete with peers around the globe and track your progress on the leaderboard.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 px-4 text-center" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
            Ready to Level Up Your DSA Skills?
          </h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of students who are mastering Data Structures and Algorithms with StudyBot's intelligent learning platform.</p>
          <Link to={user ? `/user/${userId}/courses` : '/login'}>
            <button className="px-10 py-4 bg-black border border-white rounded-lg text-white font-semibold hover:border-teal-500 hover:text-teal-500 transform hover:scale-105 transition-all duration-300">
              {user ? 'View Courses' : 'Get Started For Free'}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
