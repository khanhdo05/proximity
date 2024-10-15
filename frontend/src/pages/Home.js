import React from 'react';
import UserLocationMap from '../components/UserLocationMap';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <UserLocationMap />
    </div>
  );
}

export default Home;
