import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videoStudent, setVideoStudent] = useState(null);
  const [videoProf, setVideoProf] = useState(null);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState(null);
  const [danceName, setDanceName] = useState('');
  const [danceDate, setDanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSave = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please log in!");
    return;
  }

  // Debug: vedem ce trimitem
  console.log("Trimit token:", token);

  try {
    const response = await axios.post('http://localhost:5000/save-result', {
      dance_name: danceName,
      dance_date: danceDate,
      score: results.score,
      details: results.details // Array-ul cu cot, genunchi etc.
    }, {
      headers: { 
        'Authorization': `Bearer ${token.trim()}`, // Trim elimină spații invizibile
        'Content-Type': 'application/json'
      }
    });

    alert("Rezultat salvat cu succes!");
    setShowSaveForm(false);
  } catch (err) {
    console.error("Eroare la salvare:", err.response?.data);
    // Dacă eroarea e 422, mesajul din backend de la pasul 1 va apărea aici
    alert("Eroare: " + (err.response?.data?.message || "Eroare de autentificare"));
  }
};

  const handleUpload = async () => {
    if (!videoStudent || !videoProf) {
      alert("Please select both video clips!");
      return;
    }

    const formData = new FormData();
    formData.append('video_student', videoStudent);
    formData.append('video_prof', videoProf);

    setStatus('AI is comparing movements... Please wait.');

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
      setStatus('Analysis completed!');
    } catch (error) {
      console.error(error);
      setStatus('Error occurred while processing.');
    }
  };

  const getFileName = (file) => file ? file.name : "No file chosen";

  return (
    <div className="upload-card card">
      <div className="card-header">
        <h2>Movement Analysis</h2>
        <p className="intro">Upload both video clips to receive instant feedback from the AI.</p>
      </div>
      
      <div className="form-body">
        {/* --- INPUT STILIZAT 1 (Antrenor) --- */}
        <div className="file-wrapper">
            <span className="file-label-text">1. Reference Video (Instructor)</span>
            {/* Inputul real e ascuns */}
            <input 
                id="file-prof"
                className="file-input-hidden" 
                type="file" 
                accept="video/*" 
                onChange={(e) => setVideoProf(e.target.files[0])} 
            />
            {/* Label-ul e cel care se vede și e stilizat */}
            <label htmlFor="file-prof" className="file-input-styled">
                <span className="file-name">{getFileName(videoProf)}</span>
                <span className="file-alias-button">Choose Video</span>
            </label>
        </div>

        {/* --- INPUT STILIZAT 2 (Student) --- */}
        <div className="file-wrapper">
            <span className="file-label-text">2. Student Video (You)</span>
            <input 
                id="file-student"
                className="file-input-hidden" 
                type="file" 
                accept="video/*" 
                onChange={(e) => setVideoStudent(e.target.files[0])} 
            />
            <label htmlFor="file-student" className="file-input-styled">
                <span className="file-name">{getFileName(videoStudent)}</span>
                <span className="file-alias-button">Choose Video</span>
            </label>
        </div>

        <div style={{ marginTop: '32px' }}>
            <button className="primary-button" onClick={handleUpload} disabled={status.includes('...')} >
            {status.includes('...') ? 'Analyzing...' : 'Compare Movements'}
            </button>
            {status && <p className="status-text">{status}</p>}
        </div>
      </div>

      {results && (
        <div className="results-card">
          <h3 style={{ marginBottom: '10px' }}>Similarity Score: {results.score}%</h3>
          <div className="results-list">
            {results.details.map((item, index) => (
              <div key={index} className="result-item">
                <span className="result-badge">
                  {item.status === 'Pass' ? '✨' : '⚠️'}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>{item.zone}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                    Difference: {item.error_magnitude}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {results && !showSaveForm && (
    <button className="secondary-button" style={{ marginTop: '15px' }} onClick={() => setShowSaveForm(true)}>
        Save results to My Progress
    </button>
)}
{showSaveForm && (
    <div className="results-card" style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4>Save to Your Progress</h4>
        <input className="input-field" type="text" placeholder="Dance Name (e.g., Rumba Basic)" 
               onChange={(e) => setDanceName(e.target.value)} style={{marginBottom: '10px'}} />
        <input className="input-field" type="date" value={danceDate} 
               onChange={(e) => setDanceDate(e.target.value)} style={{marginBottom: '10px'}} />
        <p>Score to save: <strong>{results.score}%</strong></p>
        <button className="primary-button" onClick={handleSave}>Confirm Save</button>
        <button 
  className="text-button" 
  style={{ marginTop: '10px' }} 
  onClick={() => setShowSaveForm(false)}
>
  Cancel
</button>
    </div>
)}
    </div>
  );
};

export default VideoUpload;