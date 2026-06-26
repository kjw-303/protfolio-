import { useState, FormEvent } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_SECRET) {
      sessionStorage.setItem('admin_authed', 'true');
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a0a0a'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#111', padding: '48px', borderRadius: '12px',
        border: '1px solid #222', width: '320px', display: 'flex',
        flexDirection: 'column', gap: '16px'
      }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 600 }}>
          Admin
        </h2>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          style={{
            background: '#1a1a1a', border: `1px solid ${error ? '#ff4444' : '#333'}`,
            borderRadius: '8px', padding: '12px 16px', color: '#fff',
            fontSize: '14px', outline: 'none'
          }}
        />
        {error && (
          <p style={{ color: '#ff4444', fontSize: '13px', margin: 0 }}>
            비밀번호가 올바르지 않습니다.
          </p>
        )}
        <button type="submit" style={{
          background: '#fff', color: '#000', border: 'none',
          borderRadius: '8px', padding: '12px', fontSize: '14px',
          fontWeight: 600, cursor: 'pointer'
        }}>
          Enter
        </button>
      </form>
    </div>
  );
}
