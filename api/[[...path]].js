import { createApp } from '../server/src/app.js';

const app = createApp();

function withApiPrefix(req) {
  const url = req.url || '/';
  if (!url.startsWith('/api')) {
    req.url = '/api' + (url.startsWith('/') ? url : `/${url}`);
  }
  return req;
}

export default function handler(req, res) {
  return app(withApiPrefix(req), res);
}
