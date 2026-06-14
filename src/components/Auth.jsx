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
    
    const token = res.data.access_token;
    localStorage.setItem('token', token); 
    setToken(token);

      } else {
        
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  return (
    <div className="auth-card card">
      <div className="card-header" style={{textAlign: 'center'}}>
        <span className="eyebrow">{isLogin ? 'Welcome back' : 'Get started'}</span>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
      </div>
      
      <div className="form-container" style={{maxWidth: '400px', margin: '0 auto'}}>
        <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
            <input className="input-field" type="text" placeholder="Username" 
                onChange={e => setFormData({...formData, username: e.target.value})} required />
            )}
            <input className="input-field" type="email" placeholder="Email" 
            onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input className="input-field" type="password" placeholder="Password" 
            onChange={e => setFormData({...formData, password: e.target.value})} required />
            
            <button className="primary-button" type="submit" style={{marginTop: '10px' }}>
            {isLogin ? 'Login' : 'Create Account'}
            </button>
        </form>
        
        <button className="text-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
};

export default Auth;