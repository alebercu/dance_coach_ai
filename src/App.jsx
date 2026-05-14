import React, { useState } from 'react';
import Auth from './components/Auth';
import VideoUpload from './components/VideoUpload';
import Navbar from './components/Navbar';
import './App.css';
import ChatBot from './components/ChatBot';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="app-shell">
      {/* Navbar-ul apare doar dacă userul e logat */}
      {token && <Navbar onLogout={handleLogout} />}

      <header className="page-header">
        <span className="eyebrow">Powered by Mediapipe & DTW</span>
        <h1>Dance Coach AI</h1>
        <p className="intro">
          Analyze your dance moves, track your progress, and get personalized feedback with our AI-powered dance coach.
        </p>
      </header>

      <main style={{ width: '100%', maxWidth: '1100px', padding: '0 20px' }}>
        {!token ? (
          <Auth setToken={setToken} />
        ) : (
          <VideoUpload />
        )}
      </main>
      {token && <ChatBot />}
    </div>
  );
}

export default App;