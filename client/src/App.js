import { useState } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const [repoInput, setRepoInput] = useState('');
  const [repo, setRepo] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    const parts = repoInput.trim().replace('https://github.com/', '').split('/');
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      setError('Please enter a valid GitHub repo URL or owner/repo format');
      return;
    }
    setRepo({ owner: parts[0], repo: parts[1] });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: '1px solid #21262d', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3fb950' }}></div>
        <span style={{ fontWeight: 600, fontSize: 16 }}>CI/CD Pipeline Visualizer</span>
        <span style={{ fontSize: 12, color: '#8b949e', marginLeft: 4 }}>by abdulmannanbutt03</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        {!repo ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>GitHub Actions Visualizer</h1>
            <p style={{ color: '#8b949e', fontSize: 16, marginBottom: 40 }}>
              Enter any public GitHub repository to visualize its CI/CD pipeline health
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="https://github.com/owner/repo  or  owner/repo"
                style={{
                  width: 380, padding: '12px 16px', borderRadius: 8,
                  border: '1px solid #30363d', background: '#161b22',
                  color: '#e6edf3', fontSize: 14, outline: 'none'
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  padding: '12px 24px', borderRadius: 8, border: 'none',
                  background: '#238636', color: '#fff', fontWeight: 600,
                  fontSize: 14, cursor: 'pointer'
                }}
              >
                Analyze
              </button>
            </div>
            {error && <p style={{ color: '#f85149', marginTop: 16, fontSize: 14 }}>{error}</p>}
            <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['facebook/react', 'vercel/next.js', 'microsoft/vscode'].map(r => (
                <button key={r} onClick={() => { setRepoInput(r); }}
                  style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #30363d', background: 'transparent', color: '#8b949e', fontSize: 13, cursor: 'pointer' }}>
                  {r}
                </button>
              ))}
            </div>
            <p style={{ color: '#8b949e', fontSize: 12, marginTop: 12 }}>Try one of these popular repos</p>
          </div>
        ) : (
          <Dashboard owner={repo.owner} repo={repo.repo} onBack={() => setRepo(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
