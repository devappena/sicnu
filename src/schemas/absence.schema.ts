import { z } from 'zod';

/**
 * Schéma de validation pour les demandes d'absence
 */
export const absenceSchema = z.object({
  employeeId: z
    .string()
    .min(1, 'L\'employé doit être spécifié'),
  
  type: z.enum(['congé', 'maladie', 'personnel', 'formation', 'autre'], {
    errorMap: () => ({ message: 'Type d\'absence invalide' })
  }),
  
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
  
  reason: z
    .string()
    .min(10, 'La raison doit contenir au moins 10 caractères')
    .max(500, 'La raison ne peut pas dépasser 500 caractères'),
  
  document: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'Le fichier ne doit pas dépasser 5 MB'
    )
    .refine(
      (file) => !file || ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'Format de fichier non supporté (PDF, JPEG, PNG uniquement)'
    ),
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
export type AbsenceFormData = z.infer<typeof absenceSchema>;

/**
 * Schéma pour l'approbation d'absence
 */
export const absenceApprovalSchema = z.object({
  absenceId: z.string(),
  action: z.enum(['approve', 'reject']),
  comments: z
    .string()
    .max(500, 'Les commentaires ne peuvent pas dépasser 500 caractères')
    .optional(),
});

export type AbsenceApprovalData = z.infer<typeof absenceApprovalSchema>;
