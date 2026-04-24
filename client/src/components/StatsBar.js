function StatsBar({ runs }) {
  const total = runs.length;
  const successful = runs.filter(r => r.conclusion === 'success').length;
  const failed = runs.filter(r => r.conclusion === 'failure').length;
  const cancelled = runs.filter(r => r.conclusion === 'cancelled').length;
  const inProgress = runs.filter(r => r.status === 'in_progress').length;

  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

  const avgDuration = () => {
    const completed = runs.filter(r => r.created_at && r.updated_at && r.conclusion);
    if (completed.length === 0) return 'N/A';
    const avg = completed.reduce((acc, r) => {
      return acc + (new Date(r.updated_at) - new Date(r.created_at));
    }, 0) / completed.length;
    const mins = Math.floor(avg / 60000);
    const secs = Math.floor((avg % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const cards = [
    { label: 'Total Runs', value: total, color: '#58a6ff' },
    { label: 'Success Rate', value: `${successRate}%`, color: successRate >= 80 ? '#3fb950' : successRate >= 50 ? '#d29922' : '#f85149' },
    { label: 'Successful', value: successful, color: '#3fb950' },
    { label: 'Failed', value: failed, color: '#f85149' },
    { label: 'Cancelled', value: cancelled, color: '#8b949e' },
    { label: 'Avg Duration', value: avgDuration(), color: '#d2a8ff' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 28 }}>
      {cards.map(card => (
        <div key={card.label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: '16px 18px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, color: '#8b949e' }}>{card.label}</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: card.color }}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
