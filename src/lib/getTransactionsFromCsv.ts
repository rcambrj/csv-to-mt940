import currency from 'currency.js';

import { CsvRow, Transaction } from './common';

const sanitiseDescription = (description: string): string =>
  new RegExp('^(?:Card Payment to |Payment from |To |Refund from )(.*)$').exec(
    description,
  )?.[1] || '';

const getTransactionsFromCsv = (rows: CsvRow[]): Transaction[] => {
  return rows
    .reduce<Transaction[]>((transactions, row) => {
      const amount = currency(row.amount);
      const balanceAfter = currency(row.balance);
      console.log(row.balance, balanceAfter);
      const fee = currency(row.fee || 0);
      const date = new Date(row.date);

      transactions.push({
        date,
        iban: row.iban,
        name: sanitiseDescription(row.name),
        reference: row.reference,
        amount: amount.value,
        balanceAfter: balanceAfter.add(fee).value,
      });

      if (fee.value !== 0.0) {
        transactions.push({
          date,
          iban: '',
          name: 'Revolut',
          reference: `Bank transaction fee ${row.date}`,
          amount: fee.value,
          balanceAfter: balanceAfter.value,
        });
      }

      return transactions;
    }, [])
    .sort((a, b) => (a.date > b.date ? 1 : -1));
};

export default getTransactionsFromCsv;
