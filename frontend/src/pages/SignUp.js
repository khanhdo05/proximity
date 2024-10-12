import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function SignUp() {
  const Status = {
    professional: 'professional',
    dating: 'dating',
    chill: 'chill',
  };
  const { user, signup } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [professional, setProfessional] = useState('');
  const [dating, setDating] = useState('');
  const [chatting, setChatting] = useState('');
  const [locationOn, setLocationOn] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(Status.chill);

  const handleSignUp = async () => {
    try {
      const data = {
        username,
        professional,
        dating,
        chatting,
        locationOn,
        currentLabel,
      };
      await axios.post('http://localhost:8080/api/user/signup', data);
      signup(data);
      navigate('/home');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  function setSelectedLabel() {
    const selectedLabel = document.getElementById('labels').value;
    setCurrentLabel(selectedLabel);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Create Your Profile
        </h1>

        {/* Set Username */}
        {!user ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        ) : (
          <p className="mb-4 text-center text-gray-600">
            Welcome, {user.username}
          </p>
        )}

        {/* Choose Chatting Label */}
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Chatting Label
        </h2>
        <input
          type="text"
          value={chatting}
          onChange={(e) => setChatting(e.target.value)}
          placeholder="Enter your chatting label"
          className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />

        {/* Choose Professional Label */}
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Professional Label
        </h2>
        <input
          type="text"
          value={professional}
          onChange={(e) => setProfessional(e.target.value)}
          placeholder="Enter your professional label"
          className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />

        {/* Choose Dating Label */}
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Dating Label
        </h2>
        <input
          type="text"
          value={dating}
          onChange={(e) => setDating(e.target.value)}
          placeholder="Enter your dating label"
          className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />

        {/* Choose Label to Currently Display */}
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          What are you looking for?
        </h2>
        <select
          id="labels"
          onChange={setSelectedLabel}
          value={currentLabel}
          className="mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="chatting">Chatting</option>
          <option value="professional">Professional</option>
          <option value="dating">Dating</option>
        </select>

        {/* Location Visibility Toggle */}
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Change Location Visibility
        </h2>
        <label className="flex items-center mb-4">
          <span className="mr-3 text-gray-600">Location is on</span>
          <input
            type="checkbox"
            checked={locationOn}
            onChange={() => setLocationOn(!locationOn)}
            className="toggle toggle-blue"
          />
        </label>

        {/* Submit Button */}
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
