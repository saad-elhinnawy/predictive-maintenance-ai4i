'use strict';
// Minimal diagnostic server — zero dependencies, no build step needed.
// If this passes Railway's healthcheck, the issue is our build process.
// If this also fails, the Railway service itself is misconfigured.
const http = require('http');
const PORT = parseInt(process.env.PORT || '4000', 10);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
}).listen(PORT, '0.0.0.0', () => {
  console.log('Diagnostic server listening on port ' + PORT);
});
