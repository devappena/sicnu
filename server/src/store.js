import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoDataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const dataDir = process.env.VERCEL ? path.join('/tmp', 'sicnu-data') : repoDataDir;
const employeesFile = path.join(dataDir, process.env.VERCEL ? 'employees-v2.json' : 'employees.json');

const seedEmployees = [
  {
    id: '1',
    firstName: 'Victor',
    lastName: 'Bafuafua Mande',
    email: 'admin@shodan.cd',
    phone: '+243 810 000 001',
    position: 'Administrateur',
    department: 'Secrétariat général',
    salary: 1500000,
    hireDate: '2020-01-15T00:00:00.000Z',
    dateOfBirth: '1985-03-20T00:00:00.000Z',
    status: 'active',
    address: 'Gombe, Kinshasa',
    emergencyContact: { name: '', phone: '', relationship: '' },
  },
  {
    id: '2',
    firstName: 'Jonas',
    lastName: 'Maki Busha',
    email: 'drh@shodan.cd',
    phone: '+243 810 000 002',
    position: 'Directeur RH',
    department: 'Ressources humaines',
    salary: 1200000,
    hireDate: '2021-03-10T00:00:00.000Z',
    dateOfBirth: '1988-07-12T00:00:00.000Z',
    status: 'active',
    address: 'Gombe, Kinshasa',
    emergencyContact: { name: '', phone: '', relationship: '' },
  },
  {
    id: '3',
    firstName: 'Junior',
    lastName: 'Kizir Woldia',
    email: 'agent1@shodan.cd',
    phone: '+243 810 000 003',
    position: 'Assistant administratif',
    department: 'Programmes',
    salary: 600000,
    hireDate: '2022-01-20T00:00:00.000Z',
    dateOfBirth: '1992-05-15T00:00:00.000Z',
    status: 'active',
    address: 'Kinshasa',
    emergencyContact: { name: '', phone: '', relationship: '' },
  },
  {
    id: '4',
    firstName: 'Ghislain',
    lastName: 'Baende',
    email: 'agent2@shodan.cd',
    phone: '+243 810 000 004',
    position: 'Chargé de programmes',
    department: 'Programmes',
    salary: 650000,
    hireDate: '2022-06-01T00:00:00.000Z',
    dateOfBirth: '1994-09-08T00:00:00.000Z',
    status: 'active',
    address: 'Kinshasa',
    emergencyContact: { name: '', phone: '', relationship: '' },
  },
  {
    id: '5',
    firstName: 'Yasmine',
    lastName: 'Kabanga',
    email: 'yasmine.kabanga@shodan.cd',
    phone: '+243 810 000 005',
    position: 'Chargée de communication',
    department: 'Communication',
    salary: 700000,
    hireDate: '2021-06-15T00:00:00.000Z',
    dateOfBirth: '1996-12-08T00:00:00.000Z',
    status: 'active',
    address: 'Kinshasa',
    emergencyContact: { name: '', phone: '', relationship: '' },
  },
];

function ensureFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(employeesFile)) {
    fs.writeFileSync(employeesFile, JSON.stringify(seedEmployees, null, 2));
  }
}

export function readEmployees() {
  ensureFile();
  return JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
}

export function writeEmployees(employees) {
  ensureFile();
  fs.writeFileSync(employeesFile, JSON.stringify(employees, null, 2));
}
