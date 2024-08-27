
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '/Business.gif'; // Add a path to your hero image

function HomePage() {
  return (
    <div className="relative min-h-screen bg-yellow-100 p-4">
      {/* Button Container */}
      <div className="absolute top-6 right-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
        <Link to="/sign-up">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
            Sign Up
          </button>
        </Link>
        <Link to="/login">
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
            Sign In
          </button>
        </Link>
      </div>

      <motion.div 
        className="text-center mt-32"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Business Tracker</h1>
        <p className="text-base md:text-lg">
          Welcome to the Business Tracker! Manage your business operations efficiently with our comprehensive tool.
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 w-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <img src={heroImage} alt="Business Tracker" className="w-full max-w-md md:max-w-lg rounded-lg shadow-lg" />
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4 mt-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
      >
        {/* Additional content can go here */}
      </motion.div>
    </div>
  );
}

export default HomePage;
