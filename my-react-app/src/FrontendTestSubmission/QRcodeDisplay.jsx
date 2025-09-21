import React, { useState } from 'react';

const QRCodeDisplay = ({ shortcode }) => {
  const [qr, setQr] = useState(null);
  const [error, setError] = useState('');

  const fetchQr = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/qrcode/${shortcode}`);
      const data = await res.json();
      setQr(data.qr);
      setError('');
    } catch {
      setError('Failed to fetch QR code');
    }
  };

  return (
    <div>
      <button onClick={fetchQr}>Get QR Code</button>
      {qr && <img src={qr} alt="QR Code" style={{ marginTop: 8, width: 100, height: 100 }} />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default QRCodeDisplay;
