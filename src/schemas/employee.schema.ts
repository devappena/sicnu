import { z } from 'zod';

/**
 * Schéma de validation pour les employés
 */
export const employeeSchema = z.object({
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
  
  dateOfBirth: z
    .string()
    .or(z.date())
    .refine((date) => {
      const birthDate = new Date(date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    }, 'L\'employé doit avoir entre 18 et 100 ans'),
  
  hireDate: z
    .string()
    .or(z.date()),
  
  position: z
    .string()
    .min(2, 'Le poste doit contenir au moins 2 caractères')
    .max(100, 'Le poste ne peut pas dépasser 100 caractères'),
  
  department: z
    .string()
    .min(2, 'Le département doit être spécifié'),
  
  salary: z
    .number()
    .positive('Le salaire doit être positif')
    .min(1000, 'Le salaire minimum est de 1000')
    .max(10000000, 'Le salaire maximum est de 10 000 000'),
  
  status: z.enum(['active', 'inactive', 'on_leave'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }),
  
  address: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .optional(),
  
  contractType: z
    .enum(['CDI', 'CDD', 'Stage', 'Freelance'])
    .optional(),
});

/**
 * Type inféré du schéma
 */
export type EmployeeFormData = z.infer<typeof employeeSchema>;

/**
 * Schéma partiel pour les mises à jour
 */
export const employeeUpdateSchema = employeeSchema.partial();
