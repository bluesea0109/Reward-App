import { transactions } from './data'

export const fetchTransactions = () =>
  new Promise((resolve) => setTimeout(() => resolve(transactions), 1000))
