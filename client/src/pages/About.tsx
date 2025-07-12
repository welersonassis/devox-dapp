import React from "react";
const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-teal-500 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          This is the about page. We are a team dedicated to creating awesome
          things!
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-300"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;
