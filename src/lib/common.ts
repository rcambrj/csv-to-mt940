import { ImporterFieldProps } from 'react-csv-importer';

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
      date: { label: 'Date completed (UTC)' },
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
export { profiles };
