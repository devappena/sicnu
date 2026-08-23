/**
 * Identité institutionnelle SICNU / CNU-RDC.
 * Distincte du bureau de l’UNESCO à Kinshasa.
 */
export const identity = {
  appName: 'SICNU',
  appFullName:
    'Système d’information de la Commission nationale UNESCO-RDC',
  orgShort: 'CNU-RDC',
  orgName:
    'Commission Nationale de la République Démocratique du Congo pour l’UNESCO',
  country: 'République Démocratique du Congo',
  city: 'Kinshasa',
  address: 'Kinshasa, République Démocratique du Congo',
  emailDomain: 'comnat-unesco.cd',
  website: 'https://comnat-unesco.cd',
} as const;

export const demoAccounts = [
  { email: `superadmin@${identity.emailDomain}`, password: 'SuperAdmin2024!', role: 'Super administrateur' },
  { email: `admin@${identity.emailDomain}`, password: 'Admin2024!', role: 'Administrateur' },
  { email: `rh@${identity.emailDomain}`, password: 'RH2024!', role: 'Ressources humaines' },
  { email: `agent@${identity.emailDomain}`, password: 'Agent2024!', role: 'Agent' },
] as const;
