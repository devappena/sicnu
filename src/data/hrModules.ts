import type { AttendanceRecord, Candidate, CareerCase, JobOpening } from '../types';

export const mockJobOpenings: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Chargé de formation',
    department: 'Académique',
    type: 'cdi',
    status: 'open',
    openings: 2,
    publishedAt: new Date('2026-07-01'),
    description: 'Conception et animation des programmes de formation de la CNU-RDC.',
  },
  {
    id: 'job-2',
    title: 'Assistant RH',
    department: 'Ressources Humaines',
    type: 'cdd',
    status: 'interview',
    openings: 1,
    publishedAt: new Date('2026-06-15'),
    description: 'Appui au recrutement, à la paie et au suivi des dossiers du personnel.',
  },
  {
    id: 'job-3',
    title: 'Stagiaire administration',
    department: 'Administration',
    type: 'stage',
    status: 'open',
    openings: 3,
    publishedAt: new Date('2026-08-01'),
    description: 'Stage de 6 mois au secrétariat administratif.',
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    firstName: 'Amina',
    lastName: 'Kalala',
    email: 'amina.kalala@mail.cd',
    phone: '+243 810 111 222',
    status: 'interview',
    appliedAt: new Date('2026-07-12'),
  },
  {
    id: 'cand-2',
    jobId: 'job-1',
    firstName: 'Patrick',
    lastName: 'Mbuyi',
    email: 'patrick.mbuyi@mail.cd',
    phone: '+243 810 333 444',
    status: 'screening',
    appliedAt: new Date('2026-07-20'),
  },
  {
    id: 'cand-3',
    jobId: 'job-2',
    firstName: 'Sarah',
    lastName: 'Ilunga',
    email: 'sarah.ilunga@mail.cd',
    phone: '+243 810 555 666',
    status: 'offer',
    appliedAt: new Date('2026-06-22'),
  },
  {
    id: 'cand-4',
    jobId: 'job-3',
    firstName: 'David',
    lastName: 'Nsimba',
    email: 'david.nsimba@mail.cd',
    phone: '+243 810 777 888',
    status: 'received',
    appliedAt: new Date('2026-08-05'),
  },
];

export const mockCareerCases: CareerCase[] = [
  {
    id: 'onb-1',
    employeeName: 'Amina Kalala',
    department: 'Académique',
    startDate: new Date('2026-09-01'),
    type: 'onboarding',
    progress: 60,
    tasks: [
      { id: 't1', label: 'Contrat signé', done: true },
      { id: 't2', label: 'Dossier administratif', done: true },
      { id: 't3', label: 'Compte et badge', done: true },
      { id: 't4', label: 'Formation d’accueil', done: false },
      { id: 't5', label: 'Remise du matériel', done: false },
    ],
  },
  {
    id: 'onb-2',
    employeeName: 'Sarah Ilunga',
    department: 'Ressources Humaines',
    startDate: new Date('2026-08-18'),
    type: 'onboarding',
    progress: 80,
    tasks: [
      { id: 't1', label: 'Contrat signé', done: true },
      { id: 't2', label: 'Dossier administratif', done: true },
      { id: 't3', label: 'Compte et badge', done: true },
      { id: 't4', label: 'Formation d’accueil', done: true },
      { id: 't5', label: 'Remise du matériel', done: false },
    ],
  },
  {
    id: 'off-1',
    employeeName: 'Claude Mujinga',
    department: 'Sécurité',
    startDate: new Date('2026-09-30'),
    type: 'offboarding',
    progress: 40,
    tasks: [
      { id: 't1', label: 'Entretien de départ', done: true },
      { id: 't2', label: 'Restitution du matériel', done: true },
      { id: 't3', label: 'Clôture des accès', done: false },
      { id: 't4', label: 'Solde de tout compte', done: false },
      { id: 't5', label: 'Attestation de travail', done: false },
    ],
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'att-1', employeeId: '1', date: '2026-08-18', clockIn: '07:52', clockOut: '16:10', status: 'present', hours: 8.3 },
  { id: 'att-2', employeeId: '2', date: '2026-08-18', clockIn: '08:21', clockOut: '16:05', status: 'late', hours: 7.7 },
  { id: 'att-3', employeeId: '3', date: '2026-08-18', clockIn: '08:00', clockOut: null, status: 'present', hours: 0 },
  { id: 'att-4', employeeId: '4', date: '2026-08-18', clockIn: null, clockOut: null, status: 'absent', hours: 0 },
  { id: 'att-5', employeeId: '5', date: '2026-08-18', clockIn: '07:45', clockOut: '16:00', status: 'remote', hours: 8.2 },
];
