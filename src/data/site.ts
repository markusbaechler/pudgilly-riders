import data from './site.json';

export interface SiteSettings {
  email: string;
  phone: string;
  address: string;
  footerTagline: string;
  stats: {
    members: number;
    toursPerYear: number;
    founded: number;
  };
}

// Globale Einstellungen (Kontakt, Kennzahlen) – gepflegt in site.json bzw. im CMS.
export const site: SiteSettings = data as SiteSettings;
