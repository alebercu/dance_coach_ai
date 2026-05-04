import React, { useState } from 'react';
import axios from 'axios';

const Navbar = ({ onLogout }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await axios.get('http://localhost:5000/my-results', {
            headers: { 
                'Authorization': `Bearer ${token}` // ATENȚIE: Spațiul după Bearer este obligatoriu
            }
        });
        setHistory(res.data);
    } catch (err) {
        console.error("Eroare la istoric:", err.response?.status);
    }
};
  return (
    <nav className="account-bar" style={{ position: 'sticky', top: '20px', zIndex: 1000 }}>
      <div style={{ fontWeight: '800', color: 'var(--accent)' }}>DANCE AI</div>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* Meniu Hover pentru Istoric */}
        <div className="nav-item-history" onMouseEnter={fetchHistory} style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontWeight: 600 }}>My Results ▾</span>
          
          <div className="history-dropdown">
            <h4>Istoric Progres</h4>
            {loading ? <p>Se încarcă...</p> : history.length === 0 ? <p>Niciun rezultat salvat.</p> : (
              history.map((h, i) => (
                <div key={i} className="history-item">
                  <strong>{h.dance_name}</strong>
                  <span>{h.score}% - {h.dance_date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <button className="secondary-button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;