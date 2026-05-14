import React, { useState } from 'react';
import axios from 'axios';

const Navbar = ({ onLogout }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null); // Rezultatul pt care vedem detalii

  const fetchHistory = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/my-results', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Eroare la istoric", err);
    }
    setLoading(false);
  };

  return (
    <>
      <nav className="account-bar" style={{ position: 'sticky', top: '20px', zIndex: 1000 }}>
        <div style={{ fontWeight: '800', color: 'var(--accent)' }}>DANCE AI</div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div className="nav-item-history" onMouseEnter={fetchHistory} style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontWeight: 600 }}>My Results ▾</span>
            
            <div className="history-dropdown">
              <h4>Progress History</h4>
              {loading ? <p>loading...</p> : history.length === 0 ? <p>No saved results.</p> : (
                history.map((h, i) => (
                  <div key={i} className="history-item" onClick={() => setSelectedResult(h)}>
                    <strong>{h.dance_name}</strong>
                    <span>{h.score}% - {h.dance_date}</span>
                    <small style={{color: 'var(--accent)', fontSize: '0.7rem'}}>See details →</small>
                  </div>
                ))
              )}
            </div>
          </div>
          <button className="secondary-button" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* --- MODAL PENTRU DETALII --- */}
      {selectedResult && (
        <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2>{selectedResult.dance_name}</h2>
              <button className="text-button" onClick={() => setSelectedResult(null)} style={{width: 'auto', margin: 0}}>✕</button>
            </div>
            <p>Date: {selectedResult.dance_date} | Score: <strong>{selectedResult.score}%</strong></p>
            
            <div className="results-list" style={{ marginTop: '20px' }}>
  {selectedResult.details && 
    (typeof selectedResult.details === 'string' 
      ? JSON.parse(selectedResult.details) 
      : selectedResult.details
    ).map((item, index) => (
      <div key={index} className="result-item">
        <span className="result-badge">{item.status === 'Pass' ? '✨' : '⚠️'}</span>
        <div>
          <div style={{ fontWeight: 600 }}>{item.zone}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            Diferență: {item.error_magnitude}°
          </div>
        </div>
      </div>
    ))
  }
</div>
            <button className="primary-button" style={{marginTop: '20px'}} onClick={() => setSelectedResult(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;