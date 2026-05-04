import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import VideoUpload from './components/VideoUpload';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <div className="App">
      <h1>Dance Coach AI 🕺</h1>
      {!token ? (
        <Auth setToken={setToken} />
      ) : (
        <>
          <button onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Logout</button>
          <VideoUpload />
        </>
      )}
    </div>
  );
}

export default App;