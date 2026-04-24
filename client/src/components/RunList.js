import { useState } from 'react';

const statusColor = (conclusion, status) => {
  if (status === 'in_progress') return '#d29922';
  if (conclusion === 'success') return '#3fb950';
  if (conclusion === 'failure') return '#f85149';
  if (conclusion === 'cancelled') return '#8b949e';
  return '#8b949e';
};

const statusLabel = (conclusion, status) => {
  if (status === 'in_progress') return '⟳ Running';
  if (conclusion === 'success') return '✓ Success';
  if (conclusion === 'failure') return '✕ Failed';
  if (conclusion === 'cancelled') return '⊘ Cancelled';
  return conclusion || status || 'Unknown';
};

const duration = (start, end) => {
  if (!start || !end) return '—';
  const ms = new Date(end) - new Date(start);
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
};

function RunList({ runs, selectedRun, onSelect, jobs, jobsLoading }) {
  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #21262d' }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>
          Pipeline Runs <span style={{ fontWeight: 400, color: '#8b949e', fontSize: 12 }}>— click a run to see jobs</span>
        </p>
      </div>

      {runs.map(run => (
        <div key={run.id}>
          <div
            onClick={() => onSelect(run)}
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #21262d',
              cursor: 'pointer',
              background: selectedRun?.id === run.id ? '#1c2128' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1c2128'}
            onMouseLeave={e => e.currentTarget.style.background = selectedRun?.id === run.id ? '#1c2128' : 'transparent'}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor(run.conclusion, run.status), flexShrink: 0 }}></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: '#e6edf3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {run.name} — {run.head_commit?.message?.split('\n')[0] || 'No commit message'}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#8b949e' }}>
                #{run.run_number} · {run.event} · {new Date(run.created_at).toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 600, color: statusColor(run.conclusion, run.status) }}>
                {statusLabel(run.conclusion, run.status)}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#8b949e' }}>
                {duration(run.created_at, run.updated_at)}
              </p>
            </div>
          </div>

          {selectedRun?.id === run.id && (
            <div style={{ background: '#0d1117', padding: '16px 20px', borderBottom: '1px solid #21262d' }}>
              {jobsLoading ? (
                <p style={{ color: '#8b949e', fontSize: 13, margin: 0 }}>Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <p style={{ color: '#8b949e', fontSize: 13, margin: 0 }}>No jobs found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {jobs.map(job => (
                    <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#161b22', borderRadius: 8, border: '1px solid #21262d' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(job.conclusion, job.status), flexShrink: 0 }}></div>
                      <p style={{ margin: 0, fontSize: 13, color: '#e6edf3', flex: 1 }}>{job.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: statusColor(job.conclusion, job.status), fontWeight: 600 }}>
                        {statusLabel(job.conclusion, job.status)}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#8b949e' }}>
                        {duration(job.started_at, job.completed_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RunList;
