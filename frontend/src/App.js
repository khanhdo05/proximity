import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
