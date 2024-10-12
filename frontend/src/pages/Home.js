import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapComponent from './UserLocationMap'; 

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <MapComponent />
    </div>
  );
}

export default Home;
