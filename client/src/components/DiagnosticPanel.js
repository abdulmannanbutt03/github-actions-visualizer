import { useState, useEffect } from 'react';
import axios from 'axios';

const token = process.env.REACT_APP_GITHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  },
});

function DiagnosticPanel({ owner, repo, run, jobs }) {
  const [logs, setLogs] = useState({});
  const [loadingLogs, setLoadingLogs] = useState({});
  const [expandedJob, setExpandedJob] = useState(null);

  const fetchLogs = async (jobId) => {
    if (logs[jobId]) { setExpandedJob(jobId); return; }
    setLoadingLogs(prev => ({ ...prev, [jobId]: true }));
    try {
      const response = await api.get(`/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`);
      setLogs(prev => ({ ...prev, [jobId]: response.data }));
    } catch (e) {
      setLogs(prev => ({ ...prev, [jobId]: 'Could not fetch logs. They may have expired or require higher permissions.' }));
    } finally {
      setLoadingLogs(prev => ({ ...prev, [jobId]: false }));
      setExpandedJob(jobId);
    }
  };

  const getSuggestion = (jobName, conclusion) => {
    if (conclusion !== 'failure') return null;
    const name = jobName.toLowerCase();
    if (name.includes('lint')) return '💡 Fix: Run `npm run lint -- --fix` locally to auto-fix lint errors before pushing.';
    if (name.includes('build')) return '💡 Fix: Run `npm run build` locally first to catch build errors before pushing.';
    if (name.includes('test')) return '💡 Fix: Run `npm test` locally to find which test is failing and fix it.';
    if (name.includes('fuzz')) return '💡 Fix: Check for unexpected inputs in your functions that may cause crashes.';
    return '💡 Fix: Check the logs below to identify the exact error and fix it locally before pushing again.';
  };

  const statusColor = (conclusion, status) => {
    if (status === 'in_progress') return '#d29922';
    if (conclusion === 'success') return '#3fb950';
    if (conclusion === 'failure') return '#f85149';
    return '#8b949e';
  };

  const failedJobs = jobs.filter(j => j.conclusion === 'failure');
  const otherJobs = jobs.filter(j => j.conclusion !== 'failure');

  return (
    <div style={{ background: '#0d1117', border: '1px solid #f8514933', borderRadius: 10, padding: '20px', marginTop: 8 }}>
      
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: run.conclusion === 'failure' ? '#f85149' : '#d29922' }}></div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#e6edf3' }}>
          Diagnostic Report — Run #{run.run_number}
        </p>
        <span style={{ fontSize: 12, color: '#8b949e' }}>
          {run.head_commit?.message?.split('\n')[0]}
        </span>
      </div>

      {failedJobs.length === 0 && (
        <div style={{ padding: '12px 16px', background: '#161b22', borderRadius: 8, marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#8b949e' }}>
            No failed jobs in this run. Click any job below to view its logs.
          </p>
        </div>
      )}

      {failedJobs.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: '#f85149', fontWeight: 600 }}>
            ❌ Failed Jobs ({failedJobs.length})
          </p>
          {failedJobs.map(job => (
            <div key={job.id} style={{ marginBottom: 10, border: '1px solid #f8514933', borderRadius: 8, overflow: 'hidden' }}>
              <div
                onClick={() => expandedJob === job.id ? setExpandedJob(null) : fetchLogs(job.id)}
                style={{ padding: '12px 16px', background: '#161b22', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f85149' }}></div>
                <p style={{ margin: 0, fontSize: 13, color: '#e6edf3', flex: 1, fontWeight: 600 }}>{job.name}</p>
                <span style={{ fontSize: 12, color: '#8b949e' }}>{expandedJob === job.id ? '▲ Hide' : '▼ View Logs'}</span>
              </div>

              {getSuggestion(job.name, job.conclusion) && (
                <div style={{ padding: '10px 16px', background: '#1c2128', borderTop: '1px solid #21262d' }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#d29922' }}>{getSuggestion(job.name, job.conclusion)}</p>
                </div>
              )}

              {expandedJob === job.id && (
                <div style={{ padding: '12px 16px', background: '#010409', borderTop: '1px solid #21262d' }}>
                  {loadingLogs[job.id] ? (
                    <p style={{ margin: 0, fontSize: 12, color: '#8b949e' }}>Fetching logs...</p>
                  ) : (
                    <pre style={{ margin: 0, fontSize: 11, color: '#e6edf3', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 300, overflowY: 'auto', lineHeight: 1.6 }}>
                      {logs[job.id] || 'No logs available.'}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#8b949e', fontWeight: 600 }}>
          All Jobs ({jobs.length})
        </p>
        {jobs.map(job => (
          <div
            key={job.id}
            onClick={() => expandedJob === job.id ? setExpandedJob(null) : fetchLogs(job.id)}
            style={{ marginBottom: 8, padding: '10px 14px', background: '#161b22', borderRadius: 8, border: '1px solid #21262d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(job.conclusion, job.status) }}></div>
            <p style={{ margin: 0, fontSize: 13, color: '#e6edf3', flex: 1 }}>{job.name}</p>
            <span style={{ fontSize: 12, color: '#8b949e' }}>{expandedJob === job.id ? '▲ Hide Logs' : '▼ Logs'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiagnosticPanel;
