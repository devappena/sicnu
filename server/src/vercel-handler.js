import { createApp } from './app.js';

const app = createApp();

export default function handler(req, res) {
  const url = req.url || '/';
  if (!url.startsWith('/api')) {
    req.url = '/api' + (url.startsWith('/') ? url : `/${url}`);
  }
  return app(req, res);
}
