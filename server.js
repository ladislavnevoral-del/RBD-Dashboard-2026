const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// Data file path — Render.com persistent disk mounts at /data
// Locally falls back to ./data.json
const DATA_DIR  = process.env.DATA_DIR || __dirname;
const DATA_FILE = path.join(DATA_DIR, 'rbd_data.json');

// Optional write password — set RBD_WRITE_KEY in Render env vars
// If not set, anyone with URL can save (still OK for internal team)
const WRITE_KEY = process.env.RBD_WRITE_KEY || '';

app.use(express.json({ limit: '5mb' }));

// ── CORS: allow any origin (teammates from different IPs) ──────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Write-Key');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Serve the dashboard itself ─────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── GET /api/load — vrátí uložená data ────────────────────────────
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

// ── POST /api/save — uloží data ───────────────────────────────────
app.post('/api/save', (req, res) => {
  // Optional password check
  if (WRITE_KEY && req.headers['x-write-key'] !== WRITE_KEY) {
    return res.status(403).json({ ok: false, error: 'Nesprávný klíč' });
  }
  try {
    const payload = JSON.stringify(req.body, null, 2);
    fs.writeFileSync(DATA_FILE, payload, 'utf8');
    res.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    console.error('save error:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── Health check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString(), file: DATA_FILE });
});

// ── SPA fallback ───────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RBD Dashboard server běží na portu ${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Write key: ${WRITE_KEY ? 'nastaven' : 'není (otevřený zápis)'}`);
});
