import { z } from 'zod';

/**
 * Schéma de validation pour les formations
 */
export const trainingSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  
  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères'),
  
  category: z
    .string()
    .min(2, 'La catégorie doit être spécifiée'),
  
  instructor: z
    .string()
    .min(2, 'Le nom de l\'instructeur doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'instructeur ne peut pas dépasser 100 caractères'),
  
  startDate: z
    .string()
    .or(z.date())
    .refine((date) => {
      const start = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return start >= today;
    }, 'La date de début ne peut pas être dans le passé'),
  
  endDate: z
    .string()
    .or(z.date()),
  
  duration: z
    .number()
    .positive('La durée doit être positive')
    .max(1000, 'La durée ne peut pas dépasser 1000 heures'),
  
  location: z
    .string()
    .min(3, 'Le lieu doit contenir au moins 3 caractères')
    .max(200, 'Le lieu ne peut pas dépasser 200 caractères'),
  
  capacity: z
    .number()
    .int('La capacité doit être un nombre entier')
    .positive('La capacité doit être positive')
    .max(500, 'La capacité ne peut pas dépasser 500 participants'),
  
  cost: z
    .number()
    .nonnegative('Le coût ne peut pas être négatif')
    .optional(),
  
  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Statut invalide' })
  }).optional().default('scheduled'),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate']
  }
);

/**
 * Type inféré du schéma
 */
export type TrainingFormData = z.infer<typeof trainingSchema>;

/**
 * Schéma pour l'inscription à une formation
 */
export const trainingEnrollmentSchema = z.object({
  trainingId: z.string().min(1, 'La formation doit être spécifiée'),
  employeeId: z.string().min(1, 'L\'employé doit être spécifié'),
  notes: z
    .string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .optional(),
});

export type TrainingEnrollmentData = z.infer<typeof trainingEnrollmentSchema>;
