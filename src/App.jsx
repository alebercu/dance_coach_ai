import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import VideoUpload from './components/VideoUpload';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    // 'app-shell' este copilul lui '#root' care este centrat
    <div className="app-shell">
      <header className="page-header">
        <span className="eyebrow">Powered by Mediapipe & DTW</span>
        <h1>Dance Coach AI</h1>
        <p className="intro">
          Sincronizează-ți mișcările cu cele ale profesioniștilor folosind analiza biometrică avansată.
        </p>
      </header>

      {token && (
        <div className="account-bar">
          <span>Utilizator Activ</span>
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Main nu mai are nevoie de stiluri inline greoaie */}
      <main style={{ width: '100%' }}>
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