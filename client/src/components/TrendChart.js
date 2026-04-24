import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function TrendChart({ runs }) {
  const data = [...runs].reverse().map((run, index) => ({
    index: index + 1,
    duration: run.created_at && run.updated_at
      ? Math.round((new Date(run.updated_at) - new Date(run.created_at)) / 60000)
      : 0,
    status: run.conclusion,
    name: `#${run.run_number}`,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
          <p style={{ margin: '0 0 4px', color: '#e6edf3', fontWeight: 600 }}>Run {d.name}</p>
          <p style={{ margin: 0, color: '#d2a8ff' }}>Duration: {d.duration}m</p>
          <p style={{ margin: 0, color: d.status === 'success' ? '#3fb950' : d.status === 'failure' ? '#f85149' : '#8b949e' }}>
            {d.status || 'in progress'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 10, padding: '20px 24px', marginBottom: 28 }}>
      <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Build Duration Trend <span style={{ fontWeight: 400, color: '#8b949e', fontSize: 12 }}>(last {data.length} runs, in minutes)</span></p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="durationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d2a8ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d2a8ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
          <XAxis dataKey="name" stroke="#8b949e" fontSize={11} tick={{ fill: '#8b949e' }} />
          <YAxis stroke="#8b949e" fontSize={11} tick={{ fill: '#8b949e' }} unit="m" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="duration" stroke="#d2a8ff" strokeWidth={2} fill="url(#durationGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
