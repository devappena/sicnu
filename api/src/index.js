import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'sicnu-api',
    org: 'CNU-RDC',
    app: 'SICNU',
  });
});

app.use('/api', (_req, res) => {
  res.status(501).json({
    ok: false,
    message: 'Backend SICNU en construction. Le frontend tourne encore en mode démonstration.',
  });
});

app.listen(port, () => {
  console.log(`SICNU API http://localhost:${port}/api/health`);
});
