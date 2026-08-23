# SICNU

Système d’information de la **Commission Nationale de la République Démocratique du Congo pour l’UNESCO** (CNU-RDC).

Application distincte du bureau de l’UNESCO à Kinshasa. Le frontend est une démonstration RH (données mock). L’API réelle n’est pas encore branchée.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

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
  api/     backend (squelette Express, port 3000)
  public/
```

L’API :

```bash
cd api
npm install
npm run dev
```

`GET http://localhost:3000/api/health`

## Déploiement Vercel

1. Pousser le dépôt sur GitHub
2. Importer dans [Vercel](https://vercel.com)
3. Framework : Vite — Build : `npm run build` — Output : `dist`
4. Laisser `VITE_BASE_PATH` vide (racine `/`)

## Tests

```bash
npm test
```

Le moteur de paie RDC est un moteur de démonstration, non homologué DGI/INSS.
