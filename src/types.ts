
export type Language = 'ar' | 'en';

export enum DeceasedGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface HeirsData {
  deceasedGender: DeceasedGender;
  estateValue: number;
  currency: string;
  debts: number;
  willAmount: number;
  hasHusband: boolean;
  wivesCount: number;
  sonsCount: number;
  daughtersCount: number;
  hasFather: boolean;
  hasMother: boolean;
  fullBrothersCount: number;
  fullSistersCount: number;
  paternalBrothersCount: number;
  paternalSistersCount: number;
}

export interface InheritanceShare {
  heir: string;
  shareFraction: string;
  sharePercentage: number;
  amount: number;
  reason: string;
}

export interface CalculationResponse {
  totalEstate: number;
  netEstate: number;
  currency: string;
  shares: InheritanceShare[];
  educationalNote: string;
}

export interface TranslationDict {
  [key: string]: {
    // Support both simple string translations and nested translation maps for specific categories
    ar: any;
    en: any;
  };
}
