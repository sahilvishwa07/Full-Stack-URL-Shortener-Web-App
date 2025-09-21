import React, { useState } from 'react';

const Analytics = ({ shortcode }) => {
  const [clicks, setClicks] = useState(null);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/analytics/${shortcode}`);
      const data = await res.json();
      setClicks(data.clicks);
      setError('');
    } catch {
      setError('Failed to fetch analytics');
    }
  };

  return (
    <div>
      <button onClick={fetchAnalytics}>Get Analytics</button>
      {clicks !== null && <div>Clicks: {clicks}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Analytics;
