export interface ITransaction {
  merchant: string;
  item: string;
  amount: number;
  currency: string; // code
}
