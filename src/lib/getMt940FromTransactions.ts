import { Transaction } from './common';

type Options = {
  thisIban: string;
};
const getMt940FromCsv = (
  transactions: Transaction[],
  { thisIban }: Options,
): string => {
  const mt940 = 'todo';
  // todo
  console.log(transactions, thisIban);
  return mt940;
};

export default getMt940FromCsv;
