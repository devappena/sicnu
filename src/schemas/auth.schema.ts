import { z } from 'zod';

/**
 * Schéma de validation pour l'authentification
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide')
    .toLowerCase(),
  
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour le changement de mot de passe
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Le mot de passe actuel est requis'),
  
  newPassword: z
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
    ),
  
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

/**
 * Schéma de validation pour la mise à jour du profil
 */
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  
  email: z
    .string()
    .email('Adresse email invalide')
    .toLowerCase(),
  
  phone: z
    .string()
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 caractères')
    .regex(/^[\d\s+\-()]+$/, 'Format de téléphone invalide'),
  
  address: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
