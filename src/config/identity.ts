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
  { email: 'admin@shodow.com', password: '996633a', role: 'Administrateur' },
  { email: 'drh@shodow.com', password: '996633a', role: 'DRH' },
  { email: 'agent1@shodow.com', password: '996633a', role: 'Agent' },
  { email: 'agent2@shodow.com', password: '996633a', role: 'Agent' },
] as const;
