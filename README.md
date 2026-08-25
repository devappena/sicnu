# SICNU

Système d’information de la **Commission Nationale de la République Démocratique du Congo pour l’UNESCO** (CNU-RDC).

Application distincte du bureau de l’UNESCO à Kinshasa. La connexion et les employés passent par l’API. Absences, formations et paie restent en démonstration.

## Démarrage

Deux terminaux :

```bash
npm install
npm run dev
```

```bash
cd server
npm install
npm run dev
```

Frontend : [http://localhost:5173](http://localhost:5173).  
API : [http://localhost:3000/api/health](http://localhost:3000/api/health).

Comptes de démonstration :

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Administrateur | `admin@shodow.com` | `996633a` |
| DRH | `drh@shodow.com` | `996633a` |
| Agent | `agent1@shodow.com` | `996633a` |
| Agent | `agent2@shodow.com` | `996633a` |

## Structure

```
/
  src/     frontend React (Vite)
  server/  backend Express (port 3000 en local, /api sur Vercel)
  api/     point d’entrée serverless Vercel
  public/
```

L’API en local :

```bash
cd server
npm install
npm run dev
```

`GET http://localhost:3000/api/health`

## Déploiement Vercel

Le frontend et l’API partent ensemble au `git push` (même projet).

1. Pousser le dépôt sur GitHub — Vercel reconstruit le site
2. Framework : Vite — Build : `npm run build` — Output : `dist`
3. Laisser `VITE_BASE_PATH` vide (racine `/`)
4. Ne pas définir `VITE_API_BASE_URL` vers `localhost` : en production elle vaut `/api`
5. Optionnel : variable `JWT_SECRET` (secret long, uniquement dans le dashboard Vercel, pas dans Git)

La connexion en ligne utilise les mêmes comptes de démonstration qu’en local.

## Tests

```bash
npm test
```

Le moteur de paie RDC est un moteur de démonstration, non homologué DGI/INSS.
