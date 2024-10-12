import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const Status = {
    professional: "professional",
    dating: "dating",
    chill: "chill",
  };

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [professional, setProfessional] = useState("");
  const [dating, setDating] = useState("");
  const [chatting, setChatting] = useState("");
  const [locationOn, setLocationOn] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(Status.chill);


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

  function setSelectedLabel() {
    const selectedLabel = document.getElementById("labels").value;
    setCurrentLabel(selectedLabel);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Bio</h1>
      {/* set username*/}
      {!localStorage.getItem("currentUser") ? <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="mb-4 p-2 border border-gray-300 rounded"
      /> : username}

      {/* set icon */}

      {/* set label strings */}
      <h1 className="text-3xl font-bold mb-4">Choose Chatting Label</h1>
      <input
        type="text"
        value={chatting}
        onChange={(e) => setChatting(e.target.value)}
        placeholder="Enter your chatting label"
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <h1 className="text-3xl font-bold mb-4">Choose Professional Label</h1>
      <input
        type="text"
        value={professional}
        onChange={(e) => setProfessional(e.target.value)}
        placeholder="Enter your professional label"
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <h1 className="text-3xl font-bold mb-4">Choose Dating Label</h1>
      <input
        type="text"
        value={dating}
        onChange={(e) => setDating(e.target.value)}
        placeholder="Enter your dating label"
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {/* choose label to currently display */}
      <h1 className="text-3xl font-bold mb-4">Choose Label to Currently Display</h1>
      <select id="labels" onChange={setSelectedLabel} default={currentLabel}>
        <option value="chatting">Chatting</option>
        <option value="professional">Professional</option>
        <option value="dating">Dating</option>
      </select>

      {/* location on */}
      <h1 className="text-3xl font-bold mb-4">Change Location Visibility</h1>
      <label>Location is on</label>
      <input
        type="checkbox"
        value={locationOn}
        name="Location is on"
        onChange={(e) => setLocationOn(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleSignUp}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
    </div>
  );
}

export default SignUp;
