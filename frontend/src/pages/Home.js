import MapComponent from '../components/UserLocationMap';
import React from 'react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <MapComponent />
    </div>
  );
}

export default Home;
