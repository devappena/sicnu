import cors from 'cors';
import express from 'express';
import { createAuthRouter } from './auth.js';
import { createEmployeesRouter } from './employees.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'sicnu-api',
    org: 'CNU-RDC',
    app: 'SICNU',
  });
});

app.use('/api/auth', createAuthRouter());
app.use('/api/employees', createEmployeesRouter());

app.use('/api', (_req, res) => {
  res.status(501).json({
    ok: false,
    message: 'Backend SICNU en construction. Auth et employés sont disponibles.',
  });
});

app.listen(port, () => {
  console.log(`SICNU API http://localhost:${port}/api/health`);
});
