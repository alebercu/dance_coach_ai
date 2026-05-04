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
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} required />
        )}
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button type="submit">{isLogin ? 'Intră în cont' : 'Creează cont'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '10px' }}>
        {isLogin ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Loghează-te'}
      </button>
    </div>
  );
};

export default Auth;