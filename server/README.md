# SICNU API

Backend du **Système d’information de la Commission nationale UNESCO-RDC**.

## Disponible

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (Bearer)
- `GET /api/auth/verify` (Bearer)
- `GET|POST /api/employees` et `GET|PUT|DELETE /api/employees/:id` (Bearer)

Le reste sous `/api` renvoie 501. En local, les fiches sont enregistrées dans `server/data/employees.json`.

```bash
cd server
npm install
npm run dev
```

Écoute : `http://localhost:3000`.

En production (Vercel), la même API est exposée sur `/api` du site. Les comptes de test : voir le README à la racine du dépôt.
