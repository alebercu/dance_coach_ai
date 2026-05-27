import React, { useState } from 'react';

const STORAGE_KEY = 'dance_coach_todos';

const loadTodos = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const TodoList = () => {
  const [todos, setTodos] = useState(loadTodos);
  const [input, setInput] = useState('');

  const save = (updated) => {
    setTodos(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addTodo = () => {
    if (!input.trim()) return;
    save([...todos, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggle = (id) => {
    save(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const remove = (id) => {
    save(todos.filter(t => t.id !== id));
  };

  const active = todos.filter(t => !t.done);
  const done = todos.filter(t => t.done);

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-header">
        <h3 style={{ marginBottom: '4px' }}>Practice To-Do List</h3>
        <p style={{ fontSize: '0.9rem' }}>Add tips from your coach and check them off as you go.</p>
      </div>

      {/* Input adăugare */}
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

      {/* Lista activă */}
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
            <input
              type="checkbox"
              checked={false}
              onChange={() => toggle(t.id)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ flex: 1, color: 'var(--text-h)', fontSize: '0.95rem' }}>{t.text}</span>
            <button onClick={() => remove(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '1rem', padding: '0 4px'
            }}>✕</button>
          </div>
        ))}

        {/* Separator dacă există bifate */}
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
            background: 'var(--surface)', border: '1px solid var(--border)',
            opacity: 0.6
          }}>
            <input
              type="checkbox"
              checked={true}
              onChange={() => toggle(t.id)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
            />
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