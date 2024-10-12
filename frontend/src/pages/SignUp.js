import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/signup.css'; // Import the CSS file

function SignUp() {
  // TODO: Add editable fields, handle setting values better than this ugly
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
    <div className="container">
      <div className="form">
        {user ? (
          <h1 className="title">Welcome, {user.username}</h1>
        ) : (
          <h1 className="title">Create Your Profile</h1>
        )}

        {/* Set Username */}
        {!user && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="input"
          />
        )}

        {/* Choose Chatting Label */}
        <h2 className="label">Chatting Label</h2>
        {!user ? (
          <input
            type="text"
            value={chatting}
            onChange={(e) => setChatting(e.target.value)}
            placeholder="Enter your chatting label"
            className="input"
          />
        ) : (
          <p className="mb-4 text-center text-gray-600">{user.chatting}</p>
        )}

        {/* Choose Professional Label */}
        <h2 className="label">Professional Label</h2>
        {!user ? (
          <input
            type="text"
            value={professional}
            onChange={(e) => setProfessional(e.target.value)}
            placeholder="Enter your professional label"
            className="input"
          />
        ) : (
          <p className="mb-4 text-center text-gray-600">{user.professional}</p>
        )}

        {/* Choose Dating Label */}
        <h2 className="label">Dating Label</h2>
        {!user ? (
          <input
            type="text"
            value={dating}
            onChange={(e) => setDating(e.target.value)}
            placeholder="Enter your dating label"
            className="input"
          />
        ) : (
          <p className="mb-4 text-center text-gray-600">{user.dating}</p>
        )}

        {/* Choose Label to Currently Display */}
        <h2 className="label">What are you looking for?</h2>
        {!user ? (
          <select
            id="labels"
            onChange={setSelectedLabel}
            value={currentLabel}
            className="select"
          >
            <option value="chatting">Chatting</option>
            <option value="professional">Professional</option>
            <option value="dating">Dating</option>
          </select>
        ) : (
          <p className="mb-4 text-center text-gray-600">{user.currentLabel}</p>
        )}

        {/* Location Visibility Toggle */}
        <h2 className="label">Change Location Visibility</h2>
        <label className="flex items-center mb-4">
          <span className="mr-3 text-gray-600">Location is on</span>
          <input
            type="checkbox"
            checked={user ? user.locationOn : locationOn}
            onChange={() => setLocationOn(!locationOn)}
            className="toggle"
          />
        </label>

        {/* Submit Button */}
        {!user && (
          <button
            onClick={handleSignUp}
            className="submit-button"
            type="button"
          >
            Submit
          </button>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
