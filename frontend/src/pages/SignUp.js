import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/signup.css'; // Import the CSS file

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
    <div className="container">
      <div className="form">
        <h1 className="title">Create Your Profile</h1>

        {/* Set Username */}
        {!user ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="input"
          />
        ) : (
          <p className="mb-4 text-center text-gray-600">
            Welcome, {user.username}
          </p>
        )}

        {/* Choose Chatting Label */}
        <h2 className="label">Chatting Label</h2>
        <input
          type="text"
          value={chatting}
          onChange={(e) => setChatting(e.target.value)}
          placeholder="Enter your chatting label"
          className="input"
        />

        {/* Choose Professional Label */}
        <h2 className="label">Professional Label</h2>
        <input
          type="text"
          value={professional}
          onChange={(e) => setProfessional(e.target.value)}
          placeholder="Enter your professional label"
          className="input"
        />

        {/* Choose Dating Label */}
        <h2 className="label">Dating Label</h2>
        <input
          type="text"
          value={dating}
          onChange={(e) => setDating(e.target.value)}
          placeholder="Enter your dating label"
          className="input"
        />

        {/* Choose Label to Currently Display */}
        <h2 className="label">What are you looking for?</h2>
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

        {/* Location Visibility Toggle */}
        <h2 className="label">Change Location Visibility</h2>
        <label className="flex items-center mb-4">
          <span className="mr-3 text-gray-600">Location is on</span>
          <input
            type="checkbox"
            checked={locationOn}
            onChange={() => setLocationOn(!locationOn)}
            className="toggle"
          />
        </label>

        {/* Submit Button */}
        <button onClick={handleSignUp} className="submit-button">
          Submit
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
