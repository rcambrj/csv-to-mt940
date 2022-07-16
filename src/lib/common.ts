import { Options } from 'currency.js';
import { ImporterFieldProps } from 'react-csv-importer';

const currencyOptions: Options = {
  decimal: ',',
  precision: 2,

  // these are probably specific to mt940 creation
  // pattern: '#',
  // negativePattern: '-#',
};

type CsvRow = {
  date: string;
  iban: string;
  name: string;
  reference: string;
  amount: string;
  fee?: string;
  balance: string;
};

type Profile = {
  fields: {
    [key in keyof CsvRow]: Omit<ImporterFieldProps, 'name'>;
  };
  // some other source-specific configuration here
};
const profiles: Record<string, Profile> = {
  'Revolut Business': {
    fields: {
      date: { label: 'Date completed (Europe/Amsterdam)' },
      name: { label: 'Description' },
      reference: { label: 'Reference' },
      amount: { label: 'Amount' },
      fee: { label: 'Fee', optional: true },
      balance: { label: 'Balance' },
      iban: { label: 'Beneficiary IBAN' },
    },
  },
};
type ProfileName = keyof typeof profiles;

type Transaction = {
  date: Date;
  iban: string;
  name: string;
  reference: string;
  amount: number;
  balanceAfter: number;
};

export type { CsvRow, ProfileName, Transaction };
export { currencyOptions, profiles };
