import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    axios.get(`${API}/todos`, authHeader())
      .then(res => setTodos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const res = await axios.post(`${API}/todos`, { text: input.trim() }, authHeader());
    setTodos(prev => [...prev, res.data]);
    setInput('');
  };

  const toggle = async (id) => {
    const res = await axios.patch(`${API}/todos/${id}`, {}, authHeader());
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: res.data.done } : t));
  };

  const remove = async (id) => {
    await axios.delete(`${API}/todos/${id}`, authHeader());
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const active = todos.filter(t => !t.done);
  const done = todos.filter(t => t.done);

  if (loading) return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'var(--muted)' }}>
      Loading tasks...
    </div>
  );

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-header">
        <h3 style={{ marginBottom: '4px' }}>Practice To-Do List</h3>
        <p style={{ fontSize: '0.9rem' }}>Add tips from your coach and check them off as you go.</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <input
          className="input-field"
          style={{ margin: 0 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a tip or drill to practice..."
        />
        <button
          className="secondary-button"
          onClick={addTodo}
          style={{ whiteSpace: 'nowrap', padding: '0 20px' }}
        >
          + Add
        </button>
      </div>

      {active.length === 0 && done.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '20px 0' }}>
          No tasks yet — ask your coach for tips and add them here!
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {active.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px',
            background: 'var(--surface-soft)', border: '1px solid var(--border)'
          }}>
            <input type="checkbox" checked={false} onChange={() => toggle(t.id)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }} />
            <span style={{ flex: 1, color: 'var(--text-h)', fontSize: '0.95rem' }}>{t.text}</span>
            <button onClick={() => remove(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '1rem', padding: '0 4px'
            }}>✕</button>
          </div>
        ))}

        {done.length > 0 && active.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '8px 0', color: 'var(--muted)', fontSize: '0.8rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            Completed
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
        )}

        {done.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px',
            background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.6
          }}>
            <input type="checkbox" checked={true} onChange={() => toggle(t.id)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }} />
            <span style={{ flex: 1, textDecoration: 'line-through', color: 'var(--muted)', fontSize: '0.95rem' }}>{t.text}</span>
            <button onClick={() => remove(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '1rem', padding: '0 4px'
            }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;