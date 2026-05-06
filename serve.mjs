import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
};

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  let filePath = path.join(__dirname, urlPath);

  // Try the path as-is, then as a directory index, then with .html extension
  const candidates = [
    filePath,
    path.join(filePath, 'index.html'),
    filePath + '.html',
  ];

  const tryNext = (i) => {
    if (i >= candidates.length) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    fs.readFile(candidates[i], (err, data) => {
      if (err) { tryNext(i + 1); return; }
      const ext = path.extname(candidates[i]).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  };

  tryNext(0);
}).listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
