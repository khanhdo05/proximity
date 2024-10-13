import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ReceivedRequests from './pages/ReceivedRequests';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route
          path="/receivedRequests"
          element={
            <ProtectedRoute>
              <ReceivedRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
