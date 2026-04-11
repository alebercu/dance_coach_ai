import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videoStudent, setVideoStudent] = useState(null);
  const [videoProf, setVideoProf] = useState(null);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState(null);

  const handleUpload = async () => {
    if (!videoStudent || !videoProf) {
      alert("Te rog selectează ambele videoclipuri!");
      return;
    }

    const formData = new FormData();
    formData.append('video_student', videoStudent);
    formData.append('video_prof', videoProf);

    setStatus('AI-ul compară mișcările... Te rugăm să aștepți.');

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
      setStatus('Analiză finalizată!');
    } catch (error) {
      console.error(error);
      setStatus('Eroare la procesare.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h2>Coach AI: Compară Dansul</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Video Antrenor (Referință): </label>
        <input type="file" accept="video/*" onChange={(e) => setVideoProf(e.target.files[0])} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Video Student (Tu): </label>
        <input type="file" accept="video/*" onChange={(e) => setVideoStudent(e.target.files[0])} />
      </div>

      <button onClick={handleUpload} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Compară Mișcările
      </button>

      <p><strong>{status}</strong></p>

      {results && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>Scor Similitudine: {results.score}%</h3>
          <div style={{ textAlign: 'left', display: 'inline-block' }}>
            {results.details.map((item, index) => (
              <p key={index}>
                {item.status === 'Pass' ? '✅' : '❌'} <strong>{item.zone}</strong>: 
                Diferență de {item.error_magnitude}°
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;