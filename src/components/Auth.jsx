import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
      } else {
        alert("Cont creat! Acum te poți loga.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Eroare: " + err.response.data.error);
    }
  };

  return (
    <div className="auth-card card">
      <div className="card-header" style={{textAlign: 'center'}}>
        <span className="eyebrow">{isLogin ? 'Bine ai revenit' : 'Începe acum'}</span>
        <h2>{isLogin ? 'Autentificare' : 'Cont Nou'}</h2>
      </div>
      
      <div className="form-container" style={{maxWidth: '400px', margin: '0 auto'}}>
        <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
            <input className="input-field" type="text" placeholder="Nume utilizator" 
                onChange={e => setFormData({...formData, username: e.target.value})} required />
            )}
            <input className="input-field" type="email" placeholder="Email" 
            onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input className="input-field" type="password" placeholder="Parolă" 
            onChange={e => setFormData({...formData, password: e.target.value})} required />
            
            <button className="primary-button" type="submit" style={{marginTop: '10px' }}>
            {isLogin ? 'Intră în cont' : 'Creează cont'}
            </button>
        </form>
        
        <button className="text-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Nu ai un cont? Înregistrează-te' : 'Ai deja un cont? Autentifică-te'}
        </button>
      </div>
    </div>
  );
};

export default Auth;