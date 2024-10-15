import React from 'react';
import Header from '../components/Header';

function NotFound() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      </div>
    </>
  );
}

export default NotFound;
