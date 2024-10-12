import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/signup',
        {
          username,
        }
      );
      localStorage.setItem('currentUser', response.data.username);
      navigate('/home');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleSignUp}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
