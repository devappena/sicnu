import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

const DEMO_PASSWORD = '996633a';
const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

const users = [
  {
    id: '1',
    email: 'admin@shodow.com',
    passwordHash,
    firstName: 'Victor',
    lastName: 'Bafuafua',
    role: 'super_admin',
    department: 'Secrétariat général',
    position: 'Administrateur',
  },
  {
    id: '2',
    email: 'drh@shodow.com',
    passwordHash,
    firstName: 'Jacqueline',
    lastName: 'Mbombo',
    role: 'hr',
    department: 'Ressources humaines',
    position: 'Directrice RH',
  },
  {
    id: '3',
    email: 'agent1@shodow.com',
    passwordHash,
    firstName: 'Kizir',
    lastName: '',
    role: 'employee',
    department: 'Programmes',
    position: 'Assistant administratif',
  },
  {
    id: '4',
    email: 'agent2@shodow.com',
    passwordHash,
    firstName: 'Mwema',
    lastName: '',
    role: 'employee',
    department: 'Programmes',
    position: 'Chargée de programmes',
  },
];

function jwtSecret() {
  return process.env.JWT_SECRET || 'sicnu-dev-secret-change-me';
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    department: user.department,
    position: user.position,
  };
}

function signToken(user, rememberMe) {
  const expiresIn = rememberMe ? '7d' : process.env.JWT_EXPIRES_IN || '8h';
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    jwtSecret(),
    { expiresIn }
  );
  const decoded = jwt.decode(token);
  const expiresInSeconds = decoded?.exp
    ? decoded.exp - Math.floor(Date.now() / 1000)
    : 8 * 60 * 60;
  return { token, expiresIn: expiresInSeconds };
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ success: false, message: 'Non authentifié' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret());
    const user = users.find((entry) => entry.id === payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Session invalide' });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expirée' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }
    return next();
  };
}

export function createAuthRouter() {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const rememberMe = Boolean(req.body?.rememberMe);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    const user = users.find((entry) => entry.email === email);
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !valid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    const { token, expiresIn } = signToken(user, rememberMe);

    return res.json({
      success: true,
      data: {
        user: publicUser(user),
        token,
        expiresIn,
      },
    });
  });

  router.post('/logout', (_req, res) => {
    return res.json({ success: true, message: 'Déconnecté' });
  });

  router.get('/me', requireAuth, (req, res) => {
    return res.json({ success: true, data: publicUser(req.user) });
  });

  router.get('/verify', requireAuth, (_req, res) => {
    return res.json({ success: true, data: { valid: true } });
  });

  return router;
}
