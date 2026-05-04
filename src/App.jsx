import React, { useState } from 'react';
import Auth from './components/Auth';
import VideoUpload from './components/VideoUpload';
import Navbar from './components/Navbar';
import './App.css';

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
          Analizează-ți tehnica și monitorizează-ți evoluția în timp real.
        </p>
      </header>

      <main style={{ width: '100%', maxWidth: '1100px', padding: '0 20px' }}>
        {!token ? (
          <Auth setToken={setToken} />
        ) : (
          <VideoUpload />
        )}
      </main>
    </div>
  );
}

export default App;