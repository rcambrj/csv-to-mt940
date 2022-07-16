import currency from 'currency.js';
import dayjs from 'dayjs';

import { Transaction } from './common';

type Options = {
  ownBic: string;
  ownBankName: string;
  ownIban: string;
};

const getFormatted = ({
  value,
  date,
}: {
  value: number;
  date: Date;
}): {
  formattedSign: 'C' | 'D';
  absoluteValue: string;
  formattedDate: string;
} => {
  const cur = currency(value);
  return {
    formattedSign: cur.value >= 0 ? 'C' : 'D',
    absoluteValue: cur.format({
      decimal: ',',
      separator: '',
      precision: 2,
      pattern: '#',
      negativePattern: '#',
    }),
    formattedDate: dayjs(date).format('YYMMDD'),
  };
};

const getMt940FromCsv = (
  transactions: Transaction[],
  { ownBic, ownBankName, ownIban }: Options,
): string => {
  const mt940 = [];
  // write header
  mt940.push(`${ownBic}`);
  mt940.push(`940`);
  mt940.push(`${ownBic}`);
  mt940.push(`:20:${ownBankName}`);
  mt940.push(`:25:${ownIban} EUR`);
  mt940.push(`:28:00001`);

  (() => {
    const firstTransaction = transactions[0];
    const openingBalance = currency(firstTransaction.balanceAfter).subtract(
      firstTransaction.amount,
    ).value;

    const { formattedSign, absoluteValue, formattedDate } = getFormatted({
      date: firstTransaction.date,
      value: openingBalance,
    });
    mt940.push(`:60F:${formattedSign}${formattedDate}EUR${absoluteValue}`);
  })();

  // write transactions
  transactions.forEach(({ amount, date, iban, name, reference }) => {
    const { formattedSign, absoluteValue, formattedDate } = getFormatted({
      value: amount,
      date,
    });
    mt940.push(
      `:61:${formattedDate}${formattedSign}${absoluteValue}NTRFNONREF`,
    );
    mt940.push(`:86:/IBAN/${iban}/NAME/${name}/REMI/${reference}`);
  });

  // write closing balance
  (() => {
    const lastTransaction = transactions[transactions.length - 1];
    const { formattedSign, absoluteValue, formattedDate } = getFormatted({
      date: lastTransaction.date,
      value: lastTransaction.balanceAfter,
    });
    mt940.push(`:61:${formattedSign}${formattedDate}EUR${absoluteValue}`);
  })();

  return mt940.join('\n');
};

export default getMt940FromCsv;
