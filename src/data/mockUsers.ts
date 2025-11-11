/**
 * Utilisateurs de test pour le développement
 * À REMPLACER par une vraie API en production
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
    email: 'superadmin@ena.cd',
    password: 'SuperAdmin2024!',
    firstName: 'Victor',
    lastName: 'Bafuafua',
    role: 'super_admin',
    department: 'Direction Générale',
    position: 'Directeur Général'
  },
  {
    id: '2',
    email: 'admin@ena.cd',
    password: 'Admin2024!',
    firstName: 'Marie',
    lastName: 'Kabongo',
    role: 'admin',
    department: 'Administration',
    position: 'Administrateur Système'
  },
  {
    id: '3',
    email: 'rh@ena.cd',
    password: 'RH2024!',
    firstName: 'Jean',
    lastName: 'Mukendi',
    role: 'hr',
    department: 'Ressources Humaines',
    position: 'Responsable RH'
  },
  {
    id: '4',
    email: 'employe@ena.cd',
    password: 'Employe2024!',
    firstName: 'Grace',
    lastName: 'Tshimanga',
    role: 'employee',
    department: 'Administration',
    position: 'Assistant Administratif'
  }
];

/**
 * Authentifier un utilisateur (MOCK)
 * À REMPLACER par un appel API réel
 */
export const authenticateUser = (email: string, password: string): MockUser | null => {
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return null;
  }
  
  if (user.password !== password) {
    return null;
  }
  
  return user;
};

/**
 * Obtenir un utilisateur par email (MOCK)
 */
export const getUserByEmail = (email: string): MockUser | null => {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};
