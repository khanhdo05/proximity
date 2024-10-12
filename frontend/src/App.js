import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GeoService from './util/GeoService';
import Header from './components/Header';
import ReceivedRequests from './components/ReceivedRequests';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path={'/'} element={<SignUp />} />
        <Route path="/receivedRequests" element={<ReceivedRequests />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/test" element={<GeoService />} />
      </Routes>
    </div>
  );
}

export default App;
