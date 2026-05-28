const fs = require("node:fs");
const https = require("node:https");
const path = require("node:path");

const root = __dirname;
const port = Number(process.env.PORT || 4443);
const certDir = path.join(root, "certs");
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost-cert.pem");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

function safeResolve(urlPath) {
  const pathname = decodeURIComponent(new URL(urlPath, `https://localhost:${port}`).pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(root, `.${requested}`);

  if (!resolved.startsWith(root + path.sep)) {
    return null;
  }

  return resolved;
}

const server = https.createServer({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
}, (req, res) => {
  const filePath = safeResolve(req.url || "/");

  if (!filePath) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    send(res, 200, data, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Bird Voice HTTPS server listening on https://0.0.0.0:${port}`);
});
