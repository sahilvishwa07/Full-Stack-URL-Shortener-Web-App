// Simple Express backend for URL shortener
import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory stores
const users = [];
const urlStore = {};
const analytics = {};

function generateShortcode() {
  return Math.random().toString(36).substring(2, 8);
}

// User registration
app.post('/api/user/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'User exists' });
  }
  users.push({ username, password });
  res.json({ message: 'Registered' });
});

// User login
app.post('/api/user/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

// Shorten URL
app.post('/api/shorten', (req, res) => {
  const { url, validity, alias } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  let shortcode = alias || generateShortcode();
  if (urlStore[shortcode]) {
    return res.status(409).json({ error: 'Shortcode already exists' });
  }
  let expiry = null;
  if (validity && !isNaN(validity)) {
    expiry = Date.now() + parseInt(validity) * 60000;
  }
  urlStore[shortcode] = { url, expiry };
  analytics[shortcode] = 0;
  res.json({
    data: {
      tiny_url: `http://localhost:${PORT}/${shortcode}`,
      expiry: expiry ? new Date(expiry).toLocaleString() : null,
      long_url: url
    }
  });
});

// Redirect and log analytics
app.get('/:shortcode', (req, res) => {
  const entry = urlStore[req.params.shortcode];
  if (!entry) return res.status(404).send('Not found');
  if (entry.expiry && Date.now() > entry.expiry) return res.status(410).send('Link expired');
  analytics[req.params.shortcode] = (analytics[req.params.shortcode] || 0) + 1;
  res.redirect(entry.url);
});

// Analytics endpoint
app.get('/api/analytics/:shortcode', (req, res) => {
  res.json({ clicks: analytics[req.params.shortcode] || 0 });
});

// QR code endpoint
app.get('/api/qrcode/:shortcode', async (req, res) => {
  const entry = urlStore[req.params.shortcode];
  if (!entry) return res.status(404).send('Not found');
  const qr = await QRCode.toDataURL(`http://localhost:${PORT}/${req.params.shortcode}`);
  res.json({ qr });
});

app.listen(PORT, () => {
  console.log(`URL Shortener backend running on http://localhost:${PORT}`);
});
