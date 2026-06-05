'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ secret }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        setError('Incorrect access key.');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          padding: '2rem',
          borderRadius: '1rem',
          background: 'var(--color-surface-container)',
        }}
      >
        <h1 className="headline-section" style={{ marginBottom: '0.25rem' }}>
          CIES Internal Check
        </h1>
        <p className="label-meta" style={{ marginBottom: '1.5rem' }}>
          Enter access key
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            className="input-regulatory"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Access key"
            disabled={loading}
            autoFocus
            required
          />

          <button
            type="submit"
            disabled={loading || !secret}
            style={{
              background: 'var(--color-primary-cta)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.625rem 1rem',
              fontWeight: 600,
              cursor: loading || !secret ? 'not-allowed' : 'pointer',
              opacity: loading || !secret ? 0.6 : 1,
            }}
          >
            {loading ? 'Verifying…' : 'Sign in'}
          </button>

          {error && (
            <p
              role="alert"
              style={{ color: 'var(--color-error)', fontSize: '0.875rem', margin: 0 }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
