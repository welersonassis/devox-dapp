import React from "react";
import { Link } from "react-router-dom"; // Real import

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-white text-2xl font-bold">Devox</span>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            Home
          </Link>
          <Link
            to="/polls"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            Polls
          </Link>
          <Link
            to="/contact"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
