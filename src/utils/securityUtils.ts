// Utilitaires de sécurité pour le frontend ENA RH
import DOMPurify from 'dompurify';

// Configuration de sécurité
const SECURITY_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  MAX_INPUT_LENGTH: 1000,
  SUSPICIOUS_PATTERNS: [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ],
};

// Interface pour les résultats de validation
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

// Sanitisation des entrées utilisateur
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  // Limite de longueur
  const truncated = input.slice(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
  
  // Sanitisation avec DOMPurify
  return DOMPurify.sanitize(truncated, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

// Sanitisation pour HTML (contenu riche)
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
  });
};

// Validation des fichiers téléversés
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];

  // Vérification de la taille
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    errors.push(`Fichier trop volumineux. Maximum ${SECURITY_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Vérification du type de fichier
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(extension)) {
    errors.push(`Type de fichier non autorisé. Types acceptés: ${SECURITY_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`);
  }

  // Vérification du nom de fichier
  if (file.name.length > 255) {
    errors.push('Nom de fichier trop long');
  }

  // Vérification des caractères suspects dans le nom
  const suspiciousChars = /[<>:"/\\|?*]/;
  if (suspiciousChars.test(file.name)) {
    errors.push('Nom de fichier contient des caractères non autorisés');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validation des données d'employé
export const validateEmployeeData = (data: any): ValidationResult => {
  const errors: string[] = [];
  const sanitized: any = {};

  // Validation et sanitisation des champs requis
  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push('Prénom requis');
  } else {
    sanitized.firstName = sanitizeInput(data.firstName);
    if (sanitized.firstName.length < 2) {
      errors.push('Prénom trop court (minimum 2 caractères)');
    }
  }

  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push('Nom requis');
  } else {
    sanitized.lastName = sanitizeInput(data.lastName);
    if (sanitized.lastName.length < 2) {
      errors.push('Nom trop court (minimum 2 caractères)');
    }
  }

  // Validation de l'email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email requis');
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      errors.push('Format email invalide');
    } else {
      sanitized.email = data.email.toLowerCase().trim();
    }
  }

  // Validation du numéro de téléphone
  if (data.phone) {
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    if (!phonePattern.test(data.phone)) {
      errors.push('Format de téléphone invalide');
    } else {
      sanitized.phone = sanitizeInput(data.phone);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
};

// Détection de contenu suspect
export const detectSuspiciousContent = (content: string): boolean => {
  return SECURITY_CONFIG.SUSPICIOUS_PATTERNS.some(pattern => 
    pattern.test(content)
  );
};

// Génération de tokens CSRF (simulation côté client)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Stockage sécurisé dans localStorage avec chiffrement simple
export const secureStorage = {
  set: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value);
      const encoded = btoa(serialized); // Encodage simple (pas de vrai chiffrement)
      localStorage.setItem(key, encoded);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde sécurisée:', error);
    }
  },

  get: (key: string): any => {
    try {
      const encoded = localStorage.getItem(key);
      if (!encoded) return null;
      
      const serialized = atob(encoded);
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Erreur lors de la lecture sécurisée:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// Validation des mots de passe (côté client - pour UX uniquement)
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mot de passe trop court (minimum 8 caractères)');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Doit contenir au moins une minuscule');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Doit contenir au moins une majuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Doit contenir au moins un chiffre');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Doit contenir au moins un caractère spécial');
  }

  // Vérification des mots de passe faibles courants
  const weakPasswords = ['password', '123456', 'azerty', 'qwerty', 'admin'];
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Mot de passe trop faible');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Middleware de sécurité pour les requêtes
export const secureRequest = (url: string, options: RequestInit = {}): RequestInit => {
  const headers = new Headers(options.headers);
  
  // Ajout d'headers de sécurité
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('Content-Type', 'application/json');
  
  // Ajout du token CSRF si disponible
  const csrfToken = secureStorage.get('csrf_token');
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  return {
    ...options,
    headers,
    credentials: 'same-origin',
    mode: 'cors',
  };
};

// Nettoyage des données avant envoi
export const sanitizeForTransmission = (data: any): any => {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeForTransmission);
  }

  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeForTransmission(value);
    }
    return sanitized;
  }

  return data;
};

// Log de sécurité (côté client)
export const securityLog = (event: string, details?: any): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // En production, ceci devrait être envoyé à un service de logging
  console.warn('🔒 Security Event:', logEntry);
};

// Rate limiting côté client (protection basique)
export const rateLimiter = (() => {
  const attempts: { [key: string]: number[] } = {};

  return {
    check: (key: string, maxAttempts: number, windowMs: number): boolean => {
      const now = Date.now();
      
      if (!attempts[key]) {
        attempts[key] = [];
      }

      // Nettoyer les tentatives expirées
      attempts[key] = attempts[key].filter(timestamp => 
        now - timestamp < windowMs
      );

      if (attempts[key].length >= maxAttempts) {
        securityLog('Rate limit exceeded', { key, attempts: attempts[key].length });
        return false;
      }

      attempts[key].push(now);
      return true;
    },

    reset: (key: string): void => {
      delete attempts[key];
    },
  };
})();

export {
  SECURITY_CONFIG,
  type ValidationResult,
};
