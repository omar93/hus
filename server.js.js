import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-style __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Logga varje besök vid GET /
app.get('/', (req, res) => {
  const logEntry = {
    time: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent']
  };

  const logPath = path.join(__dirname, 'data', 'visitors.log');
  fs.appendFile(logPath, JSON.stringify(logEntry) + '\n', err => {
    if (err) console.error('Kunde inte logga besök:', err);
  });

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servera statiska filer (JS, CSS m.m.)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
