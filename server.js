const express = require('express');
const path    = require('path');
const fs      = require('fs');
 
const app  = express();
const PORT = process.env.PORT || 3000;
 
const DATA_DIR  = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'rbd_data.json');
const WRITE_KEY = process.env.RBD_WRITE_KEY || '';
 
app.use(express.json({ limit: '5mb' }));
 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Write-Key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
 
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), file: DATA_FILE });
});
 
app.get('/api/load', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) return res.json({ ok: true, data: null });
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json({ ok: true, data: JSON.parse(raw) });
  } catch (e) {
    console.error('load error:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});
 
app.post('/api/save', (req, res) => {
  if (WRITE_KEY && req.headers['x-write-key'] !== WRITE_KEY) {
    return res.status(403).json({ ok: false, error: 'Nesprávný klíč' });
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    console.error('save error:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});
 
const STATIC_DIR = fs.existsSync(path.join(__dirname, 'public', 'index.html'))
  ? path.join(__dirname, 'public')
  : __dirname;
 
console.log('Serving static files from:', STATIC_DIR);
 
app.use(express.static(STATIC_DIR));
 
app.get('*', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});
 
app.listen(PORT, () => {
  console.log('RBD Dashboard server bezi na portu ' + PORT);
  console.log('Data file: ' + DATA_FILE);
  console.log('Write key: ' + (WRITE_KEY ? 'nastaven' : 'neni (otevreny zapis)'));
});
 