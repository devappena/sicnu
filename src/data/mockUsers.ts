/**
 * Utilisateurs de démonstration.
 * À remplacer par l’authentification réelle de l’API SICNU.
 */

export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'hr' | 'employee';
  department?: string;
  position?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'superadmin@comnat-unesco.cd',
    password: 'SuperAdmin2024!',
    firstName: 'Aline',
    lastName: 'Kalala',
    role: 'super_admin',
    department: 'Secrétariat général',
    position: 'Secrétaire générale',
  },
  {
    id: '2',
    email: 'admin@comnat-unesco.cd',
    password: 'Admin2024!',
    firstName: 'Marie',
    lastName: 'Kabongo',
    role: 'admin',
    department: 'Administration',
    position: 'Administratrice système',
  },
  {
    id: '3',
    email: 'rh@comnat-unesco.cd',
    password: 'RH2024!',
    firstName: 'Jean',
    lastName: 'Mukendi',
    role: 'hr',
    department: 'Ressources humaines',
    position: 'Responsable RH',
  },
  {
    id: '4',
    email: 'agent@comnat-unesco.cd',
    password: 'Agent2024!',
    firstName: 'Grace',
    lastName: 'Tshimanga',
    role: 'employee',
    department: 'Programmes',
    position: 'Assistante administrative',
  },
];

export const authenticateUser = (email: string, password: string): MockUser | null => {
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return null;
  }
  return user;
};

export const getUserByEmail = (email: string): MockUser | null => {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
};
