// SignupScreen.js
import React from 'react';
import { Link } from 'react-router-dom';
import Register from './Register';

const SignupScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-md shadow-md w-full sm:max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Signup</h2>
        <Register />
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;