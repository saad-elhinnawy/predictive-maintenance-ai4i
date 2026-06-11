const http = require('http');
const port = process.env.PORT || 4000;
http.createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{"status":"ok"}');
}).listen(port, () => console.log('UP on port', port));
