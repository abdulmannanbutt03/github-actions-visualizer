import { useState, useEffect } from 'react';
import { getWorkflowRuns, getJobsForRun } from '../utils/github';
import StatsBar from './StatsBar';
import RunList from './RunList';
import TrendChart from './TrendChart';

function Dashboard({ owner, repo, onBack }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRun, setSelectedRun] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getWorkflowRuns(owner, repo);
        setRuns(data);
      } catch (e) {
        setError('Could not fetch pipeline data. Make sure the repo is public and has GitHub Actions.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [owner, repo]);

  const handleSelectRun = async (run) => {
    if (selectedRun?.id === run.id) { setSelectedRun(null); setJobs([]); return; }
    setSelectedRun(run);
    setJobsLoading(true);
    try {
      const data = await getJobsForRun(owner, repo, run.id);
      setJobs(data);
    } catch (e) {
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #30363d', borderTop: '3px solid #3fb950', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
      <p style={{ color: '#8b949e' }}>Fetching pipeline data...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ color: '#f85149', fontSize: 16 }}>{error}</p>
      <button onClick={onBack} style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, border: '1px solid #30363d', background: 'transparent', color: '#e6edf3', cursor: 'pointer' }}>Go back</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button onClick={onBack} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #30363d', background: 'transparent', color: '#8b949e', cursor: 'pointer', fontSize: 13 }}>← Back</button>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{owner}/{repo}</h2>
          <p style={{ margin: 0, color: '#8b949e', fontSize: 13 }}>Last {runs.length} pipeline runs</p>
        </div>
        <a href={`https://github.com/${owner}/${repo}/actions`} target="_blank" rel="noreferrer"
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, border: '1px solid #30363d', background: 'transparent', color: '#58a6ff', cursor: 'pointer', fontSize: 13, textDecoration: 'none' }}>
          View on GitHub ↗
        </a>
      </div>

      <StatsBar runs={runs} />
      <TrendChart runs={runs} />
      <RunList runs={runs} selectedRun={selectedRun} onSelect={handleSelectRun} jobs={jobs} jobsLoading={jobsLoading} />
    </div>
  );
}

export default Dashboard;
