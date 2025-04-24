import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white-600 to-black-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          🗳️ Automated Election System
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          Secure. Transparent. Real-Time. Revolutionizing the way we vote.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link
            to="/login"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold text-lg transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-full font-semibold text-lg transition duration-300"
          >
            Register
          </Link>
        </div>

        <div className="mt-10">
          <p className="text-gray-500 text-sm">
            Powered with ❤️ by <span className="font-semibold text-indigo-600">Dinusha</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
