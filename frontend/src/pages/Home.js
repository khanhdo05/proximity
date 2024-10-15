<<<<<<< Updated upstream
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/UserLocationMap';
import Chat from '../components/Chat';
=======
import React from 'react';
import UserLocationMap from '../components/UserLocationMap';
>>>>>>> Stashed changes

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <MapComponent />
    </div>
  );
}

export default Home;
