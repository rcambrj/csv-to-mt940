import currency from 'currency.js';

import { CsvRow, currencyOptions, Transaction } from './common';

const sanitiseDescription = (description: string): string =>
  new RegExp('^(?:Card Payment to |Payment from |To |Refund from )(.*)$').exec(
    description,
  )?.[1] || '';

const getTransactionsFromCsv = (rows: CsvRow[]): Transaction[] => {
  return rows.reduce<Transaction[]>((transactions, row) => {
    const amount = currency(row.amount, currencyOptions);
    const balanceAfter = currency(row.balance, currencyOptions);
    const fee = currency(row.fee || 0, currencyOptions);
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
  }, []);
};

export default getTransactionsFromCsv;
