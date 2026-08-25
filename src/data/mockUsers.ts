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

const DEMO_PASSWORD = '996633a';

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@shodan.cd',
    password: DEMO_PASSWORD,
    firstName: 'Victor',
    lastName: 'Bafuafua Mande',
    role: 'super_admin',
    department: 'Secrétariat général',
    position: 'Administrateur',
  },
  {
    id: '2',
    email: 'drh@shodan.cd',
    password: DEMO_PASSWORD,
    firstName: 'Jonas',
    lastName: 'Maki Busha',
    role: 'hr',
    department: 'Ressources humaines',
    position: 'Directeur RH',
  },
  {
    id: '3',
    email: 'agent1@shodan.cd',
    password: DEMO_PASSWORD,
    firstName: 'Junior',
    lastName: 'Kizir Woldia',
    role: 'employee',
    department: 'Programmes',
    position: 'Assistant administratif',
  },
  {
    id: '4',
    email: 'agent2@shodan.cd',
    password: DEMO_PASSWORD,
    firstName: 'Ghislain',
    lastName: 'Baende',
    role: 'employee',
    department: 'Programmes',
    position: 'Chargé de programmes',
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
